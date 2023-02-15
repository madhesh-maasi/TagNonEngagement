import * as React from 'react';
import styles from '../AnmNonEngagement.module.scss';
import ListItemService from "../../../../services/ListItemService";
import UserService from "../../../../services/UserService";
import Dropdown from 'react-dropdown';
const options = [
    { value: '', label: '' },
    { value: '5', label: '5' },
    { value: '4', label: '4' },
    { value: '3', label: '3' },
    { value: '2', 'label': '2' },

];
export default class RatingDropDown extends React.Component<any, {}> {
    private listItemService: ListItemService;
    private userService: UserService;
    constructor(props: any) {
        super(props);
        this.state = {

            IsLoading: true,
            AppContext: this.props.AppContext,
           data: ["1", "2", "3", "4", "5"],
            SelectedRatingKey: props.value
        };

    }
    public async componentDidMount() {
        // Fetch Loggred user name, Roles and tax year, Mentor
    }

    public render(): React.ReactElement<any> {
        return (
            <React.Fragment>
                <Dropdown options={this.state["data"]}
                    value={this.state["SelectedRatingKey"]}
                    data-name={this.props.name}
                    placeholder="Select an option"
                    // onChange={e => { this.setState({ SelectedRatingKey: e["value"] }) }}
                    onChange={(e) => { this.props.onRatingsValueChange(e["value"], this.props.name); 
                        this.setState({
                            SelectedRatingKey: e["value"]
                        });
                      
                    }}
                />
            </React.Fragment >
        );
    }

}
