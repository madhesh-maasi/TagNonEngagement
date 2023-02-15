
import { TAG_SectionANMExperience } from "./TAG_SectionANMExperience";
import { TAG_SectionPreANMExperience } from "./TAG_SectionPreANMExperience";
import { User } from "./types/User";

export class TAG_EmployeeDetails {
    public ID: number;
    public Title?: string;
    public Employee: User;
    public Mentor: User;
    public EmployeeJobTitle?: string;
    public Certifications?: string;
    public Office: string;
    public HireDate: Date;
    public HireDateForSP: string;
    public SectionANMExperience: TAG_SectionANMExperience;
    public SectionPreANMExperience: TAG_SectionPreANMExperience;
}


export class TAG_GenericDetails {
    public Title?: string;
    public SortOrder: number;  
}