
import { People } from "../people/people"

export interface Task{
  name: string,
  endDate: Date,
  people: People[]
}
