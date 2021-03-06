import React from "react";
import { Button } from "carbon-components-react";
import { Add16 } from "@carbon/icons-react";

import GroupList from "./GroupList";
import "./AllGroups.scss";

const AllGroups = () => {
  return (
    <div className="all-groups">
      <div className="all-groups__header">
        <h1>Groups</h1>
        <Button renderIcon={Add16} href="/groups/new">
          New group
        </Button>
      </div>
      <GroupList />
    </div>
  );
};

export default AllGroups;
