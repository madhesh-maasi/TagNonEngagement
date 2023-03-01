import * as React from "react";
import styles from "./SubmitSpecialReviews.module.scss";
import { ISubmitSpecialReviewsProps } from "./ISubmitSpecialReviewsProps";
import { escape } from "@microsoft/sp-lodash-subset";
import {
  Dropdown,
  IDropdownOption,
  Label,
  PrimaryButton,
  TextField,
} from "office-ui-fabric-react";
import {
  DateConvention,
  DateTimePicker,
  TimeConvention,
  TimeDisplayControlType,
} from "@pnp/spfx-controls-react";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { Config } from "../../../globals/Config";
import ListItemService from "../../../services/ListItemService";
import { Enums } from "../../../globals/Enums";
import MapResult from "../../../domain/mappers/MapResult";
import { TAG_SpecialReviews } from "../../../domain/models/TAG_SpecialReviews";
import { SubmitSpecialReviewsState } from "../../submitSpecialReviews/components/SubmitSpecialReviewsState";
import { sp } from "@pnp/sp";

export default class SubmitSpecialReviews extends React.Component<
  ISubmitSpecialReviewsProps,
  SubmitSpecialReviewsState,
  {}
> {
  private ServiceLineOptions: IDropdownOption[] = [];
  private ServiceLineOptionsAll: IDropdownOption[] = [];
  private ServiceLines: IDropdownOption[] = [];
  private ProjectStatusOptions: IDropdownOption[] = [];
  private ListItemService: ListItemService;
  private hasEditItemPermission: boolean = true;
  constructor(props: any) {
    super(props);

    this.state = {
      IsCreateMode:
        this.props.ItemID == undefined ||
        this.props.ItemID == null ||
        this.props.ItemID == 0
          ? true
          : false,
      hasEditItemPermission: false,
      IsLoading: true,
      AppContext: this.props.AppContext,
      DisableSaveButton: true,
      SpecialReviews: new TAG_SpecialReviews(),
    };
    let dropDownOption: any[] = [];
    dropDownOption.push({
      key: "Capital Markets & Accounting Advisory",
      text: "Capital Markets & Accounting Advisory",
    });
    dropDownOption.push({
      key: "Financial Due Diligence",
      text: "Financial Due Diligence",
    });
    dropDownOption.push({
      key: "Global Transaction Analytics",
      text: "Global Transaction Analytics",
    });
    dropDownOption.push({
      key: "Data Intelligence Gateway",
      text: "Data Intelligence Gateway",
    });
    this.ServiceLines = dropDownOption;
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onchangedLastDateHoursBilled =
      this.onchangedLastDateHoursBilled.bind(this);
    this.onChangeRevieweeName = this.onChangeRevieweeName.bind(this);
    this.onChangeLeadMDName = this.onChangeLeadMDName.bind(this);

    this.onChangeProjectCode = this.onChangeProjectCode.bind(this);
    this.onChangeProjectName = this.onChangeProjectName.bind(this);
    this.onchangedProjectStartDate = this.onchangedProjectStartDate.bind(this);
    this.onchangedProjectEndDate = this.onchangedProjectEndDate.bind(this);
    this.onChangeHoursWorked = this.onChangeHoursWorked.bind(this);
    this.onChangeJobTitle = this.onChangeJobTitle.bind(this);
    this.onChangeProjectStatus = this.onChangeProjectStatus.bind(this);
    this.onChangeClientName = this.onChangeClientName.bind(this);
    this.onChangeServiceLines = this.onChangeServiceLines.bind(this);
  }
  public async componentDidMount() {
    console.log(this.props.AppContext);
    this.FillProjectStatusOptions();
    this.FillServiceLineOptions();
    if (this.state.IsCreateMode) {
      this.setState({
        IsLoading: false,
      });
    } else {
      this.ListItemService = new ListItemService(
        this.props.AppContext,
        Config.ListNames.SpecialReviews
      );
      this.hasEditItemPermission =
        await this.ListItemService.CheckCurrentUserCanEditItem(
          this.props.ItemID
        );
      const SpecialReviewsDetails: TAG_SpecialReviews =
        await this.ListItemService.getItemUsingCAML(
          this.props.ItemID,
          [],
          undefined,
          Enums.ItemResultType.TAG_SpecialReview
        );
      this.setState({
        IsLoading: false,
        hasEditItemPermission: this.hasEditItemPermission,
        SpecialReviews: SpecialReviewsDetails,
      });
    }
  }
  private async FillProjectStatusOptions() {
    this.ListItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.SpecialReviews
    );
    let GetServiceLine = await this.ListItemService.getFieldChoices(
      Config.SpecialReviewsListColumns.ProjectStatus
    );
    let GetServiceLineOption: any[] = [];
    if (GetServiceLine != undefined) {
      var j = 0;
      for (var i = 0; i < Object.keys(GetServiceLine).length; i++) {
        var qData = {};
        qData["text"] = GetServiceLine[Object.keys(GetServiceLine)[i]];
        qData["key"] = GetServiceLine[Object.keys(GetServiceLine)[i]];
        GetServiceLineOption.push(qData);
      }
    }
    this.ProjectStatusOptions = GetServiceLineOption;
  }
  private async FillServiceLineOptions() {
    this.ListItemService = new ListItemService(
      this.props.AppContext,
      Config.ListNames.SpecialReviews
    );
    let GetServiceLine = await this.ListItemService.getFieldChoices(
      Config.SpecialReviewsListColumns.JobTitle
    );
    let GetServiceLineOption: any[] = [];
    let GetServiceLineOptionAll: any[] = [];
    if (GetServiceLine != undefined) {
      var j = 0;
      for (var i = 0; i < Object.keys(GetServiceLine).length; i++) {
        var qDataAll = {};
        qDataAll["text"] = GetServiceLine[Object.keys(GetServiceLine)[i]];
        qDataAll["key"] = GetServiceLine[Object.keys(GetServiceLine)[i]];
        GetServiceLineOptionAll.push(qDataAll);

        var qData = {};
        if (
          GetServiceLine[Object.keys(GetServiceLine)[i]] !=
            "Data And Project Manager" &&
          GetServiceLine[Object.keys(GetServiceLine)[i]] !=
            "Senior Data Analyst"
        ) {
          qData["text"] = GetServiceLine[Object.keys(GetServiceLine)[i]];
          qData["key"] = GetServiceLine[Object.keys(GetServiceLine)[i]];
          GetServiceLineOption.push(qData);
        }
      }
    }
    this.ServiceLineOptions = GetServiceLineOption;
    this.ServiceLineOptionsAll = GetServiceLineOptionAll;
  }
  private async onChangeRevieweeName(items: any[]) {
    let curretState = this.state.SpecialReviews;
    if (items != null && items.length > 0) {
      curretState.RevieweeName = await MapResult.map(
        items[0],
        Enums.MapperType.PnPControlResult,
        Enums.ItemResultType.User
      );
      curretState.RevieweeNameEmail = curretState.RevieweeName.Email;
    }
  }
  private onChangeClientName(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValueText: string
  ): void {
    let curretState = this.state.SpecialReviews;
    curretState.ClientName = newValueText;
    this.onFormTextFieldValueChange(curretState);
  }

  private async onChangeLeadMDName(items: any[]) {
    let curretState = this.state.SpecialReviews;
    if (items != null && items.length > 0) {
      curretState.LeadMDName = await MapResult.map(
        items[0],
        Enums.MapperType.PnPControlResult,
        Enums.ItemResultType.User
      );
      curretState.LeadMDNameEmail = curretState.LeadMDName.Email;
    }
  }

  private async onChangeReviewerName(items: any[]) {
    let curretState = this.state.SpecialReviews;
    if (items != null && items.length > 0) {
      curretState.ReviewerName = await MapResult.map(
        items[0],
        Enums.MapperType.PnPControlResult,
        Enums.ItemResultType.User
      );
      curretState.ReviewerNameEmail = curretState.ReviewerName.Email;
    }
  }

  private async onChangeProjectCode(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string
  ) {
    debugger;
    let curretState = this.state.SpecialReviews;
    curretState.ProjectCode = newValue;
    this.onFormTextFieldValueChange(curretState);
  }
  private async onChangeProjectName(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string
  ) {
    let curretState = this.state.SpecialReviews;
    curretState.Title = newValue;
    this.onFormTextFieldValueChange(curretState);
  }
  private async onChangeHoursWorked(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string
  ) {
    debugger;
    let curretState = this.state.SpecialReviews;
    curretState.HoursWorked = newValue;
    this.onFormTextFieldValueChange(curretState);
  }
  private async onChangeEmployeeNumber(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue: string
  ) {
    let curretState = this.state.SpecialReviews;
    curretState.EmployeeNumber = newValue;
    this.onFormTextFieldValueChange(curretState);
  }

  private onChangeJobTitle(newValue: string): void {
    let curretState = this.state.SpecialReviews;
    curretState.JobTitle = newValue;
    this.onFormTextFieldValueChange(curretState);
  }
  private onChangeProjectStatus(newValue: string): void {
    let curretState = this.state.SpecialReviews;
    curretState.ProjectStatus = newValue;
    this.onFormTextFieldValueChange(curretState);
  }

  private onchangedProjectStartDate(date1: any): void {
    let curretState = this.state.SpecialReviews;
    curretState.ProjectStartDate = date1;
    this.onFormTextFieldValueChange(curretState);
  }
  private onChangeServiceLines(newValue1: string): void {
    let curretState = this.state.SpecialReviews;
    curretState.ServiceLine = newValue1;
    this.onFormTextFieldValueChange(curretState);
  }
  private onchangedProjectEndDate(date2: any): void {
    let curretState = this.state.SpecialReviews;
    curretState.ProjectEndDate = date2;
    this.onFormTextFieldValueChange(curretState);
  }
  private onchangedLastDateHoursBilled(date: any): void {
    let curretState = this.state.SpecialReviews;
    curretState.LastHoursBilled = date;
    this.onFormTextFieldValueChange(curretState);
  }
  private _onFormatDate = (date: Date): string => {
    return (
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    );
  };

  private async onSave(): Promise<void> {
    debugger;
    const SpecialReviews = this.state.SpecialReviews;
    let data = {};
    const columns = Config.SpecialReviewsListColumns;
    data[Config.BaseColumns.Title] = SpecialReviews.Title;
    data[columns.RevieweeNameId] = SpecialReviews.RevieweeName.Id;
    data[columns.LeadMDNameId] = SpecialReviews.LeadMDName.Id;

    data[columns.ProjectCode] = SpecialReviews.ProjectCode;
    data[columns.HoursWorked] = Number(SpecialReviews.HoursWorked);
    data[columns.JobTitle] = SpecialReviews.JobTitle;
    data[columns.ProjectStatus] = SpecialReviews.ProjectStatus;
    data[columns.LastHoursBilled] = SpecialReviews.LastHoursBilled;
    data[columns.ClientName] = SpecialReviews.ClientName;
    data[columns.ProjectStartDate] = SpecialReviews.ProjectStartDate;
    data[columns.ProjectEndDate] = SpecialReviews.ProjectEndDate;
    data[columns.ServiceLine] = SpecialReviews.ServiceLine;

    if (this.state.IsCreateMode) {
      this.ListItemService = new ListItemService(
        this.props.AppContext,
        Config.ListNames.SpecialReviews
      );
      await this.ListItemService.createItem(data);
      this.gotoListPage();
    } else {
      this.ListItemService = new ListItemService(
        this.props.AppContext,
        Config.ListNames.SpecialReviews
      );
      await this.ListItemService.updateItem(this.props.ItemID, data);
      this.gotoListPage();
    }
  }
  private async onCancel(): Promise<void> {
    this.gotoListPage();
  }
  private gotoListPage() {
    let returnURL =
      this.props.AppContext.pageContext.web.absoluteUrl +
      Config.Links.HomePageLink;
    window.location.href = returnURL;
    return false;
  }

  private validateSave(updateDetails: TAG_SpecialReviews): boolean {
    let valid: boolean = false;
    const details = updateDetails;
    if (!this.hasEditItemPermission) {
      valid = true;
    }
    if (
      updateDetails.Title != "" &&
      updateDetails.Title != undefined &&
      updateDetails.LeadMDNameEmail != "" &&
      updateDetails.LeadMDNameEmail != undefined &&
      updateDetails.RevieweeNameEmail != "" &&
      updateDetails.RevieweeNameEmail != undefined &&
      updateDetails.ClientName != "" &&
      updateDetails.ClientName != undefined &&
      updateDetails.ProjectStartDate != undefined &&
      updateDetails.ProjectEndDate != undefined &&
      updateDetails.HoursWorked != "" &&
      updateDetails.HoursWorked != undefined
    ) {
      valid = true;
    }
    return valid;
  }

  private onFormTextFieldValueChange(updateDetails: TAG_SpecialReviews) {
    let allowSave: boolean = true;
    allowSave = this.validateSave(updateDetails);
    this.setState({
      SpecialReviews: updateDetails,
      DisableSaveButton: !allowSave,
    });
  }

  public render(): React.ReactElement<ISubmitSpecialReviewsProps> {
    return (
      <React.Fragment>
        <div className={styles.submitSpecialReviews}>
          <div className={styles.container}>
            <img
              src={require("../../../assets/Images/performancemgmtgraphic.png")}
              alt="Performance Management"
              className="fullimg"
            />
            <hr className={styles.hr}></hr>
            <div className={styles.row}>
              <div className={styles.divCompetency}>
                <Label>
                  <b>CREATE A SPECIAL REVIEW</b>
                </Label>
              </div>
              <div className={styles.divCompetency}>
                <Label>
                  Use to create a review for a project not entered into Agresso,
                  create a copy of an existing review already in progress, or
                  rebuild a review accidentally deleted from the Projects list.
                </Label>
              </div>
              <hr className={styles.hr}></hr>

              <div className={styles.row}>
                <div className={styles.lblTitle}>
                  {" "}
                  <Label>
                    <b>
                      Project Name<span style={{ color: "#ff0000" }}>*</span>
                    </b>
                  </Label>
                </div>
                <div className={styles.txtReviewIDs}>
                  <TextField
                    resizable={false}
                    multiline={false}
                    value={this.state.SpecialReviews.Title}
                    onChange={this.onChangeProjectName}
                  ></TextField>{" "}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.lblTitle}>
                  {" "}
                  <Label>
                    <b>
                      Reviewee Name<span style={{ color: "#ff0000" }}>*</span>
                    </b>
                  </Label>
                </div>
                <div className={styles.txtReviewIDs}>
                  {
                    <PeoplePicker
                      context={this.props.AppContext}
                      personSelectionLimit={1}
                      groupName={""} // Leave this blank in case you want to filter from all users
                      showtooltip={true}
                      ensureUser={true}
                      showHiddenInUI={false}
                      principalTypes={[PrincipalType.User]}
                      onChange={this.onChangeRevieweeName}
                      defaultSelectedUsers={[
                        this.state.SpecialReviews.RevieweeNameEmail,
                      ]}
                      resolveDelay={1000}
                    />
                  }
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.lblTitle}>
                  {" "}
                  <Label>
                    <b>
                      Lead MD Name<span style={{ color: "#ff0000" }}>*</span>
                    </b>
                  </Label>
                </div>
                <div className={styles.txtReviewIDs}>
                  {
                    <PeoplePicker
                      context={this.props.AppContext as any}
                      personSelectionLimit={1}
                      groupName={""} // Leave this blank in case you want to filter from all users
                      showtooltip={true}
                      ensureUser={true}
                      showHiddenInUI={false}
                      principalTypes={[PrincipalType.User]}
                      onChange={this.onChangeLeadMDName}
                      defaultSelectedUsers={[
                        this.state.SpecialReviews.LeadMDNameEmail,
                      ]}
                      resolveDelay={1000}
                    />
                  }
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.lblTitle}>
                  {" "}
                  <Label>
                    <b>
                      Project Code<span style={{ color: "#ff0000" }}>*</span>
                    </b>
                  </Label>
                </div>
                <div className={styles.txtReviewIDs}>
                  <TextField
                    resizable={false}
                    multiline={false}
                    value={this.state.SpecialReviews.ProjectCode}
                    onChange={this.onChangeProjectCode}
                  ></TextField>{" "}
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.lblTitle}>
                  {" "}
                  <Label>
                    <b>
                      Client Name<span style={{ color: "#ff0000" }}>*</span>
                    </b>
                  </Label>
                </div>
                <div className={styles.txtReviewIDs}>
                  <TextField
                    resizable={false}
                    multiline={false}
                    value={this.state.SpecialReviews.ClientName}
                    onChange={this.onChangeClientName}
                  ></TextField>{" "}
                </div>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.lblTitle}>
                {" "}
                <Label>
                  <b>
                    Project Start Date
                    <span style={{ color: "#ff0000" }}>*</span>
                  </b>
                </Label>
              </div>
              <div className={styles.txtReviewIDs11}>
                <DateTimePicker
                  dateConvention={DateConvention.Date}
                  timeConvention={TimeConvention.Hours12}
                  timeDisplayControlType={TimeDisplayControlType.Dropdown}
                  showLabels={false}
                  formatDate={this._onFormatDate}
                  value={this.state.SpecialReviews.ProjectStartDate}
                  onChange={this.onchangedProjectStartDate}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.lblTitle}>
                {" "}
                <Label>
                  <b>
                    Project End Date<span style={{ color: "#ff0000" }}>*</span>
                  </b>
                </Label>
              </div>
              <div className={styles.txtReviewIDs11}>
                <DateTimePicker
                  dateConvention={DateConvention.Date}
                  timeConvention={TimeConvention.Hours12}
                  timeDisplayControlType={TimeDisplayControlType.Dropdown}
                  showLabels={false}
                  formatDate={this._onFormatDate}
                  value={this.state.SpecialReviews.ProjectEndDate}
                  onChange={this.onchangedProjectEndDate}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.lblTitle}>
                {" "}
                <Label>
                  <b>
                    Hours Worked<span style={{ color: "#ff0000" }}>*</span>
                  </b>
                </Label>
              </div>
              <div className={styles.txtReviewIDs11}>
                <TextField
                  resizable={false}
                  multiline={false}
                  value={this.state.SpecialReviews.HoursWorked}
                  onChange={this.onChangeHoursWorked}
                ></TextField>{" "}
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.lblTitle}>
                {" "}
                <Label>
                  <b>Service Line:</b>
                </Label>
              </div>
              <div className={styles.txtReviewIDs11}>
                <Dropdown
                  className={styles.dropServiceLine}
                  placeholder="Please select a value"
                  options={this.ServiceLines}
                  selectedKey={this.state.SpecialReviews.ServiceLine}
                  onChange={(e, selectedOption) => {
                    this.onChangeServiceLines(selectedOption.text);
                  }}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.lblTitle}>
                {" "}
                <Label>
                  <b>
                    Job Title <br />
                    (Determines review template)
                  </b>
                </Label>
              </div>
              <div className={styles.txtReviewIDs11}>
                <Dropdown
                  className={styles.dropServiceLine}
                  placeholder="Please select a value"
                  options={
                    this.state.SpecialReviews.ServiceLine ==
                    "Data Intelligence Gateway"
                      ? this.ServiceLineOptionsAll
                      : this.ServiceLineOptions
                  }
                  selectedKey={this.state.SpecialReviews.JobTitle}
                  onChange={(e, selectedOption) => {
                    this.onChangeJobTitle(selectedOption.text);
                  }}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.lblTitle}>
                {" "}
                <Label>
                  <b>Project Status</b>
                </Label>
              </div>
              <div className={styles.txtReviewIDs11}>
                <Dropdown
                  className={styles.dropServiceLine}
                  placeholder="Please select a value"
                  options={this.ProjectStatusOptions}
                  selectedKey={this.state.SpecialReviews.ProjectStatus}
                  onChange={(e, selectedOption) => {
                    this.onChangeProjectStatus(selectedOption.text);
                  }}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.lblTitle}>
                {" "}
                <Label>
                  <b>
                    Last Hours Billed <br />
                    (if known)
                  </b>
                </Label>
              </div>
              <div className={styles.txtReviewIDs11}>
                <DateTimePicker
                  dateConvention={DateConvention.Date}
                  timeConvention={TimeConvention.Hours12}
                  timeDisplayControlType={TimeDisplayControlType.Dropdown}
                  showLabels={false}
                  formatDate={this._onFormatDate}
                  value={this.state.SpecialReviews.LastHoursBilled}
                  onChange={this.onchangedLastDateHoursBilled}
                />
              </div>
            </div>

            <div className={styles.row}>
              {this.state.IsCreateMode && (
                <PrimaryButton
                  className={
                    this.state.DisableSaveButton
                      ? styles.btnSave
                      : styles.btnSaveEnable
                  }
                  disabled={this.state.DisableSaveButton}
                  text="CREATE NEW REVIEW"
                  onClick={this.onSave}
                ></PrimaryButton>
              )}
              <PrimaryButton
                className={styles.btnCancel}
                text="Cancel"
                onClick={this.onCancel}
              ></PrimaryButton>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
