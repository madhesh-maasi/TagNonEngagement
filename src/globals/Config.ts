// This namespace contains solution specific Configuration items
export namespace Config {

    export const Search_RowLimit = 250;
    export const List_ThresholdLimit = 5000;

    // Date Formats
    export const DateFormatMoment = "";

    export const ListNames = {
        EmployeeSummary: "Employee Summary",
        Mentor: "Mentor",
        NonEngReview: "Non Engagement Reviews",
        NonEngReviewredirectUrl:"Non Engagement Review",
        FiscalYears: "FiscalYears",
        Roles: "Roles",
        Projects: "Projects",
        Questionnaire: "Questionnaire",
        CombineReviews : "Combine Reviews",
        SpecialReviews : "Special Reviews",
        SplitReviews : "Split Reviews",
        CombineAdmin:"Combine Admin",
        SplitAdmin : "Split Admin",
    };

   

    export const ListCAMLFields = {
    };

    // List sharepoint generated columns with internal name
    export const BaseColumns = {
        Id: "Id",
        Title: "Title"
    };
    // List sharepoint generated columns with internal name
    export const BaseColumns2 = {
        SortOrder: "SortOrder",
        Title: "Title"
    };
    // Key Value pair of Employee Summary list column title and internal names
    export const EmployeeSummaryListColumns = {
        "ANMExperience": "A_x0026_M_x0020_Experience",
        "Certifications": "Certifications",
        "Company": "Company_x002f_Firm",
        "Fiscal Year": "Fiscal_x0020_Year",
        "Group": "Group",
        "Hire Date": "Hire_x0020_Date",
        "Job Title": "Job_x0020_Title",
        "Level": "Level",
        "Mentor": "Mentor",
        "Mentor Id": "MentorId",
        "Name": "Name",
        "Name Id": "NameId",
        "Office": "Office",
        "Pre-A&M Experience": "Pre_x002d_A_x0026_M_x0020_Experi",
        "Previous  Level": "Previous_x0020__x0020_Level",
        "Utilization": "Utilization",
        "Years": "Years"
    };

    export const SplitReviewsListColumns = {
        "SourceReviewID": "Source_x0020_Review_x0020_ID",
        "HourstoReview": "Hours_x0020_to_x0020_Review",
        "SplitReviewID": "Split_x0020_Review_x0020_ID",
        "ServiceLine":"Service_x0020_Line",
        "JobTitle":"Job_x0020_Title"
    };


    export const SplitAdminListColumns = {
        "SourceReviewID": "Source_x0020_Review_x0020_ID",
        "HourstoReview": "Hours_x0020_to_x0020_Review",
        "SplitReviewID": "Split_x0020_Review_x0020_ID",
        "RevieweeName" : "Reviewee_x0020_Name",
        "RevieweeNameId" : "Reviewee_x0020_NameId",
        "ServiceLine":"Service_x0020_Line",
        "JobTitle":"Job_x0020_Title",
        "StatusFlag" : "StatusFlag"
    };
    
    export const CombineReviewsListColumns = {
        "ReviewIDs": "Review_x0020_IDs",
        "ProjectManager": "Project_x0020_Manager",
        "ProjectStartDate": "Project_x0020_Start_x0020_Date",
        "ProjectEndDate": "Project_x0020_End_x0020_Date",
        "JobTitle": "Job_x0020_Title",
        "LastHoursBilled": "Last_x0020_Hours_x0020_Billed",
        "NewReviewID": "New_x0020_Review_x0020_ID",
        "ClientName":"Customer_x0020_Name",
        "ServiceLine":"Service_x0020_Line"

    };
    export const SpecialReviewsListColumns = {
        "EmployeeNumber": "Employee_x0020_Number",
        "HoursWorked": "Hours_x0020_Worked",
        "JobTitle": "JobTitle1",
        "LastHoursBilled": "Last_x0020_Hours_x0020_Billed",
        "LeadMDName": "Lead_x0020_MD_x0020_Name",
        "LeadMDNameId": "Lead_x0020_MD_x0020_NameId",
        "NewReviewID": "New_x0020_Review_x0020_ID",
        "ProjectCode": "Project_x0020_Code",
        "ProjectStatus": "Project_x0020_Status",
        "RevieweeName": "Reviewee_x0020_Name",
        "RevieweeNameId": "Reviewee_x0020_NameId",
        "ReviewerName": "Reviewer_x0020_Name",
        "ReviewerNameId": "Reviewer_x0020_NameId",
        "ClientName":"Customer_x0020_Name",
        "ProjectStartDate": "Project_x0020_Start_x0020_Date",
        "ProjectEndDate": "Project_x0020_End_x0020_Date",
        "ServiceLine":"Service_x0020_Line"
    };

    export const CombineAdminListColumns = {
        "ReviewIDs": "Review_x0020_IDs",
        "ProjectManager": "Project_x0020_Manager",
        "ProjectStartDate": "Project_x0020_Start_x0020_Date",
        "ProjectEndDate": "Project_x0020_End_x0020_Date",
        "JobTitle": "JobTitle1",
        "LastHoursBilled": "Last_x0020_Hours_x0020_Billed",
        "NewReviewID": "New_x0020_Review_x0020_ID",
        "RevieweeName" : "Reviewee_x0020_Name",
        "RevieweeNameId" : "Reviewee_x0020_NameId",
        "ServiceLine":"Service_x0020_Line",
        "ClientName":"Customer_x0020_Name",
        "StatusFlag" : "StatusFlag"
    };

    // Key Value pair of Mentor list column title and internal names
    export const MentorListColumns = {
        "RevieweeName": "Reviewee_x0020_Name",
        "RevieweeName Id": "Reviewee_x0020_NameId",
        "Mentor": "Mentor_x0020_Name",
        "Mentor Id": "Mentor_x0020_NameId"
    };
    // Key Value pair of Non Eng review Summary list column title and internal names
    export const NonEngagementReviewTemplateColumns = {
        "RevieweeName": "Reviewee_x0020_Name",
        "RevieweeId": "Reviewee_x0020_NameId",
        "FiscalYear": "Fiscal_x0020_Year",
        "Role": "Role",
        "StatusReview": "Status_x0020_of_x0020_Review",
        "Submitted": "Submitted",
        "MentorId": "Mentor_x0020_NameId",
        "Mentor": "Mentor_x0020_Name",
        "RDQ1": "OData__x0052_DQ1",
        "RDQ2": "OData__x0052_DQ2",
        "RDQ3": "OData__x0052_DQ3",
        "RDQ4": "OData__x0052_DQ4",
        "RDQ5": "OData__x0052_DQ5",
        "GetRDQ1": "_x0052_DQ1",
        "GetRDQ2": "_x0052_DQ2",
        "GetRDQ3": "_x0052_DQ3",
        "GetRDQ4": "_x0052_DQ4",
        "GetRDQ5": "_x0052_DQ5",
        "RDComments": "RDComments",
        "SummaryOfImprovement": "SummaryOfImprovement",
        "SummaryOfProgress": "SummaryOfProgress",
        "SummaryOfStrengths": "SummaryOfStrengths",
        "OtherConsiderations": "OtherConsiderations",
        "RDTAComments": "RDTAComments",
        "RDTAQ2": "RDTAQ2",
        "RDTAQ3": "RDTAQ3",
        "RDTAQ1": "RDTAQ1",
        "SignoffHistory": "Signoff_x0020_History",
        "RAC": "REVIEWEE_x0020_ACKNOWLEDGEMENT_x",
        "ORC": "Optional_x0020_Reversion_x0020_C",

        "BQ1": "OData__x0042_DQ1",
        "BQ2": "OData__x0042_DQ2",
        "BQ3": "OData__x0042_DQ3",
        "BQ4": "OData__x0042_DQ4",
        "BDComments": "BDComments",

        "GetBQ1": "_x0042_DQ1",
        "GetBQ2": "_x0042_DQ2",
        "GetBQ3": "_x0042_DQ3",
        "GetBQ4": "_x0042_DQ4",
      


        "PD1": "OData__x0050_DQ1",
        "PD2": "OData__x0050_DQ2",
        "PD3": "OData__x0050_DQ3",
        "PD4": "OData__x0050_DQ4",
        "PDComments": "PDComments",

        "GetPD1": "_x0050_DQ1",
        "GetPD2": "_x0050_DQ2",
        "GetPD3": "_x0050_DQ3",
        "GetPD4": "_x0050_DQ4",


        "FYYTDUtilization": "FYYTDUtilization",
        "Title":"Title"
    };



    // Key Value pair of Project list column title and internal names
    export const ProjectListColumns = {
        
        "ID":"ID",
        "ProjectName": "Title",
        "ProjectCode": "Project_x0020_Code",
        "ReviewerName": "Reviewer_x0020_Name",
        "LeadMDName": "Lead_x0020_MD_x0020_Name",
        "HoursWorked": "Hours_x0020_Worked",
        "ProjectStartDate": "Project_x0020_Start_x0020_Date",
        "ProjectEndDate": "Project_x0020_End_x0020_Date",
        "LastHoursBilled": "Last_x0020_Hours_x0020_Billed",
        "ProjectStatus": "Project_x0020_Status",
        "ClientName" : "Customer_x0020_Name",
        "RevieweeName":"Reviewee_x0020_Name",
   
    };
    export const Links = {
        EmployeeSummaryListAllItems: "/Lists/Employee%20Summary/AllItems.aspx",
        HomePageLink: "/"
    };

    export const Strings = {
        NotApplicable: "NA",
        EmployeeAlreadyAdded: "Employee Details are already present for the current employee. Please select another employee name."
    };
    

}