
import { User } from "./types/User";

export class TAG_SpecialReviews {
    public ID: number;
    public Title?: string;
    public LeadMDName: User;
    public LeadMDNameEmail: string;
    public RevieweeName: User;
    public RevieweeNameEmail: string;
    public ReviewerName: User;
    public ReviewerNameEmail: string;
    public EmployeeNumber: string;
    public HoursWorked: string;
    public JobTitle: string;
    public LastHoursBilled: Date;
    public NewReviewID: string;
    public ProjectCode: string;
    public ProjectStatus: string;
    public ProjectStartDate:  Date;
    public ProjectEndDate: Date;
    public ServiceLine: string;
    public ClientName: string;
}