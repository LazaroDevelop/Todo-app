
import { People } from "../people/people";
import { TaskStatus} from "./task-status";

export interface Task{
  id: number,
  name: string,
  status: TaskStatus,
  endDate: Date,
  people: People[]
}
