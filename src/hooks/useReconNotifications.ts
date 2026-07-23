import { useMemo } from "react";
import { T, stageInfo } from "@/lib/recon-data";
import { useJobs, type DbJob } from "@/hooks/useJobs";

export interface ReconNotification {
  id: string;
  title: string;
  detail: string;
  icon: string;
  color: string;
  job?: DbJob;
}

/** Derive live notifications from existing job data (no new tables / persistence). */
export const useReconNotifications = (): ReconNotification[] => {
  const { jobs } = useJobs();
  return useMemo<ReconNotification[]>(() => {
    const items: ReconNotification[] = [];
    jobs.forEach((j) => {
      if ((j.moisture_alerts || 0) > 0) {
        items.push({
          id: `moist-${j.id}`,
          title: `${j.moisture_alerts} moisture alert${j.moisture_alerts === 1 ? "" : "s"}`,
          detail: `${j.id} · ${j.customer}`,
          icon: "moisture",
          color: T.blueBright,
          job: j,
        });
      }
      if (j.priority === "high" && j.stage !== "closed") {
        items.push({
          id: `urgent-${j.id}`,
          title: "Urgent job needs attention",
          detail: `${j.id} · ${j.customer}`,
          icon: "alert",
          color: T.redBright,
          job: j,
        });
      }
      if (j.stage === "carrier_approval") {
        items.push({
          id: `carrier-${j.id}`,
          title: "Awaiting carrier approval",
          detail: `${j.id} · ${stageInfo(j.stage).label}`,
          icon: "shield",
          color: T.yellowBright,
          job: j,
        });
      }
    });
    return items;
  }, [jobs]);
};
