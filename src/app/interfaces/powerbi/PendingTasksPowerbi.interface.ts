import { ProcessPowerbi } from "src/app/commons/enums/StatusColorsPowerbi.enum";

export interface PendingTasksPowerbi {
  workspace: string,
  processType: ProcessPowerbi,
  taskId: string
}
