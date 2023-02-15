import * as React from 'react';
import styles from './AnmNonEngagement.module.scss';
import { IAnmNonEngagementProps } from './IAnmNonEngagementProps';
import Reviewee from './Reviewee/Reviewee';
import RevieweeForm from './Reviewee/RevieweeForm';
import { escape } from '@microsoft/sp-lodash-subset';
import UserService from "../../../services/UserService";
import { User } from "../../../domain/models/types/User";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  HashRouter
} from "react-router-dom";
import 'react-dropdown/style.css';
export default class AnmNonEngagement extends React.Component<IAnmNonEngagementProps, {}> {

  private userService: UserService;
  constructor(props: any) {
    super(props);
    this.state = {
      IsCreateMode: (this.props.ItemID == undefined || this.props.ItemID == null || this.props.ItemID == 0) ? true : false,
      IsLoading: true,
      AppContext: this.props.AppContext,
      user: {}
    };

  }
  public async componentDidMount() {
    // Check Type
   
   
    console.log("Pops main", this.props);
    const queryParams = new URLSearchParams(window.location.search);
    const itemID = queryParams.get('ItemID');
    const IsCreateMode = (itemID == undefined || itemID == null) ? true : false;
    this.setState({ IsCreateMode: IsCreateMode });
    this.userService = new UserService(this.props.AppContext);
    let expectedCurrentUser: User = await this.userService.GetCurrentUser();
    this.setState({ user: expectedCurrentUser });
    console.log("User is", expectedCurrentUser);

  }
  public render(): React.ReactElement<IAnmNonEngagementProps> {
    return (
      <div className={styles.anmNonEngagement}>
        <div className={styles.row}>
          <img src={require('../../../assets/Images/performancemgmtgraphic.png')} alt="Performance Management" className='fullimg' />
          <div className='container'>
            <HashRouter>    <Route path="/" exact render={(props) => (
              <Reviewee AppContext={this.props.AppContext} ItemID={this.props.ItemID} user={this.state["user"]} />
            )} />

              <Route path="/ItemID/:id" render={(props) => (
                <RevieweeForm AppContext={this.props.AppContext} ItemID={this.props.ItemID} user={this.state["user"]} />
              )} /></HashRouter>
              
            {/* {this.state["IsCreateMode"] && <Reviewee AppContext={this.props.AppContext} ItemID={this.props.ItemID} user={this.state["user"]} />}

            {!this.state["IsCreateMode"]  && <RevieweeForm AppContext={this.props.AppContext} ItemID={this.props.ItemID} user={this.state["user"]} />} */}

          </div>

        </div>
      </div>
    );
  }
}
