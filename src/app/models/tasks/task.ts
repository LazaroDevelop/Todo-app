
import { People } from "../people/people";
import { TaskStatus} from "./task-status";

export interface Task{
  name: string,
  status: TaskStatus,
  endDate: Date,
  people: People[]
}
