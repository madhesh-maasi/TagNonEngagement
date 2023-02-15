import { User } from "./types/User";
export class TAG_Projects {
    public ClientName: string;
    public ID?: number;
    public ProjectName?: string;
    public ProjectCode?: string;
    public ReviewerName: User;
    public RevieweeName: User;
    public LeadMDName: User;
    public HoursWorked: number;
    public ProjectStartDate: Date;
    public ProjectEndDate: Date;
    public LastHoursBilled: Date;
    public ProjectStatus: string;
}