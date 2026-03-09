import { useState, useRef } from "react";
import { T } from "@/lib/recon-data";
import { Badge, ReconCard as Card, Btn, Ic, Inp, Sel } from "@/components/recon/ReconUI";
import { useJobPhotos, useActivityLogs } from "@/hooks/useJobs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { DbJob } from "@/hooks/useJobs";

type FilterType = "all" | "photo" | "document" | "estimate" | "supplement" | "note";

const PHOTO_TYPES = [
  { value: "photo", label: "Photo" },
  { value: "document", label: "Document" },
  { value: "estimate", label: "Estimate" },
  { value: "supplement", label: "Supplement" },
];

export const JobPhotosTab = ({ job }: { job: DbJob }) => {
  const [filter, setFilter] = useState<FilterType>("all");
  const { photos, loading: photosLoading, refetch } = useJobPhotos(job.id);
  const { logs } = useActivityLogs(job.id);
  const { user, companyId, profile } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState("photo");
  const [caption, setCaption] = useState("");
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDesc, setNoteDesc] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const filters: { id: FilterType; label: string; icon: string }[] = [
    { id: "all", label: "All", icon: "eye" },
    { id: "photo", label: "Photos", icon: "photo" },
    { id: "document", label: "Documents", icon: "note" },
    { id: "estimate", label: "Estimates", icon: "est" },
    { id: "supplement", label: "Supplements", icon: "est" },
    { id: "note", label: "Notes", icon: "edit" },
  ];

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !user) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const filePath = `${job.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage.from("job-photos").upload(filePath, file);
      if (uploadError) {
        toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
        continue;
      }

      const { data: urlData } = supabase.storage.from("job-photos").getPublicUrl(filePath);
      const url = urlData?.publicUrl || "";

      await supabase.from("job_photos").insert({
        job_id: job.id, url, caption: caption || file.name,
        photo_type: uploadType, uploaded_by: user.id,
        uploaded_by_name: profile?.name || user.email || "User",
        company_id: companyId || null,
      } as any);

      // Log activity
      await supabase.from("activity_logs").insert({
        title: `${uploadType === "photo" ? "Photo" : "File"} uploaded: ${file.name}`,
        description: caption || null,
        action_type: uploadType,
        job_id: job.id, user_id: user.id,
        user_name: profile?.name || user.email || "User",
        company_id: companyId || null,
      } as any);
    }

    toast({ title: "Upload complete", description: `${files.length} file(s) uploaded` });
    setCaption("");
    setUploading(false);
    refetch();
  };

  const handleDelete = async (photo: any) => {
    if (!confirm("Delete this file?")) return;
    const { error } = await supabase.from("job_photos").delete().eq("id", photo.id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    else { toast({ title: "File deleted" }); refetch(); }
  };

  const handleAddNote = async () => {
    if (!user || !noteTitle.trim()) return;
    setSavingNote(true);
    const { error } = await supabase.from("activity_logs").insert({
      title: noteTitle, description: noteDesc || null,
      action_type: "note", job_id: job.id, user_id: user.id,
      user_name: profile?.name || user.email || "User",
      company_id: companyId || null,
    } as any);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    else { toast({ title: "Note added" }); setNoteTitle(""); setNoteDesc(""); setShowNoteForm(false); window.location.reload(); }
    setSavingNote(false);
  };

  // Build combined timeline
  const filteredPhotos = photos.filter((p: any) => filter === "all" || p.photo_type === filter);
  const filteredNotes = (filter === "all" || filter === "note") ? logs.filter((l: any) => l.action_type === "note") : [];

  const timeline = [
    ...filteredPhotos.map((p: any) => ({ ...p, _type: "file", _date: new Date(p.created_at) })),
    ...filteredNotes.map((n: any) => ({ ...n, _type: "note", _date: new Date(n.created_at) })),
  ].sort((a, b) => b._date.getTime() - a._date.getTime());

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: T.white, fontSize: 15 }}>Photos & Documents</div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn v="secondary" sz="sm" icon="edit" onClick={() => setShowNoteForm(!showNoteForm)}>
            {showNoteForm ? "Cancel" : "Add Note"}
          </Btn>
          <Btn v="primary" sz="sm" icon="upload" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Files"}
          </Btn>
        </div>
      </div>

      {/* Upload controls */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-end" }}>
        <Sel label="File Type" options={PHOTO_TYPES} value={uploadType} onChange={e => setUploadType(e.target.value)} />
        <Inp label="Caption (optional)" placeholder="Describe the file..." value={caption} onChange={e => setCaption(e.target.value)} />
        <div style={{ fontSize: 11, color: T.dim, paddingBottom: 10 }}>
          Supports photos, PDFs, documents. CompanyCam integration coming soon.
        </div>
      </div>

      <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
        style={{ display: "none" }} onChange={e => handleUpload(e.target.files)} />

      {/* Note Form */}
      {showNoteForm && (
        <Card style={{ marginBottom: 16, borderColor: `${T.tealBright}44` }}>
          <div style={{ fontWeight: 700, color: T.tealBright, fontSize: 14, marginBottom: 12 }}>Add Note</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Inp label="Title *" placeholder="Note title" value={noteTitle} onChange={e => setNoteTitle(e.target.value)} required />
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: T.muted }}>Description</label>
              <textarea value={noteDesc} onChange={e => setNoteDesc(e.target.value)} rows={3} placeholder="Details..."
                style={{ background: T.surfaceHigh, border: `1px solid ${T.border}`, borderRadius: 7, padding: "9px 12px", color: T.text, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", resize: "vertical" }} />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
            <Btn v="secondary" onClick={() => setShowNoteForm(false)}>Cancel</Btn>
            <Btn v="primary" icon="check" onClick={handleAddNote} disabled={savingNote || !noteTitle.trim()}>
              {savingNote ? "Saving..." : "Save Note"}
            </Btn>
          </div>
        </Card>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, overflowX: "auto" }}>
        {filters.map(f => (
          <div key={f.id} onClick={() => setFilter(f.id)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, cursor: "pointer",
            background: filter === f.id ? T.orangeDim : T.surfaceHigh,
            border: `1px solid ${filter === f.id ? T.orange + "55" : T.border}`,
            transition: "all 0.12s",
          }}>
            <Ic n={f.icon} s={13} c={filter === f.id ? T.orange : T.muted} />
            <span style={{ fontSize: 12, fontWeight: filter === f.id ? 600 : 400, color: filter === f.id ? T.orange : T.muted, whiteSpace: "nowrap" }}>{f.label}</span>
          </div>
        ))}
      </div>

      {/* Timeline */}
      {timeline.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: T.surfaceHigh, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Ic n="photo" s={28} c={T.dim} />
          </div>
          <div style={{ fontWeight: 600, color: T.white, fontSize: 15, marginBottom: 6 }}>No items yet</div>
          <div style={{ fontSize: 13, color: T.muted }}>Upload photos and documents or add notes to build your project timeline</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {timeline.map((entry: any, i: number) => (
            <div key={entry.id || i} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: i < timeline.length - 1 ? `1px solid ${T.border}` : "none" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 2 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: entry._type === "note" ? T.tealBright : T.orange, flexShrink: 0 }} />
                {i < timeline.length - 1 && <div style={{ width: 2, flex: 1, background: T.border, marginTop: 4 }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>
                    {entry._type === "file" ? (entry.caption || "Uploaded file") : entry.title}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: T.muted }}>{entry._date.toLocaleDateString()}</span>
                    {entry._type === "file" && (
                      <button onClick={() => handleDelete(entry)} title="Delete" style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                        <Ic n="x" s={12} c={T.redBright} />
                      </button>
                    )}
                  </div>
                </div>
                {entry._type === "file" && entry.url && (
                  <div style={{ marginBottom: 4 }}>
                    {entry.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img src={entry.url} alt={entry.caption || ""} style={{ maxHeight: 120, borderRadius: 6, border: `1px solid ${T.border}` }} />
                    ) : (
                      <a href={entry.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: T.blueBright, textDecoration: "underline" }}>
                        Open file ↗
                      </a>
                    )}
                  </div>
                )}
                {entry._type === "note" && entry.description && (
                  <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{entry.description}</div>
                )}
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  <Badge color="gray" small>{entry._type === "file" ? (entry.photo_type || "file") : "note"}</Badge>
                  {(entry.uploaded_by_name || entry.user_name) && (
                    <span style={{ fontSize: 11, color: T.dim }}>by {entry.uploaded_by_name || entry.user_name}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
