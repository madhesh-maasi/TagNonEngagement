
import { User } from "./types/User";
export class TAG_ProjectListView {
    public ID?: number;
    public ProjectName?: string;
    public ProjectCode?: string;
    public RevieweeName: User;
    public ReviewerName: User;
    public LeadMDName: User;
    public HoursWorked: number;
    public ProjectStartDate: Date;
    public ProjectEndDate: Date;
    public LastHoursBilled: Date;
    public ProjectStatus: string;
   
}