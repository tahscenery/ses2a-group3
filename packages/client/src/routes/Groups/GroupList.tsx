import React, { useEffect, useState } from "react";
import {
  Button,
  SkeletonText,
  Tag,
  TagSkeleton,
  Tile,
} from "carbon-components-react";
import { Edit16 } from "@carbon/icons-react";

import { Group } from "api/group";
import { User } from "api/user";
import { AuthApi, GroupApi, InterestApi, UserApi } from "api";

type GroupTileProps = {
  userId: string;
  token: string;
  group?: Group;
};

const GroupTile = ({ userId, token, group }: GroupTileProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const [moderator, setModerator] = useState<User>(undefined);
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    const fetchModerator = async () => {
      return await UserApi.readUser({ _id: group.moderator, token });
    };

    const fetchInterests = async () => {
      const pendingInterests = group.interests.map(async interestId => {
        return (await InterestApi.readInterest({ _id: interestId })).name;
      });

      return await Promise.all(pendingInterests);
    };

    fetchModerator()
      .then(moderator => {
        setModerator(moderator);
        setIsLoading(false);
      })
      .catch(error => console.error(`Failed to fetch moderator: ${error}`));

    fetchInterests()
      .then(interest => {
        setInterests(interest);
        setIsLoading(false);
      })
      .catch(error => console.error(`Failed to fetch interests: ${error}`));
  }, [group.interests, group.moderator, token]);

  return (
    <Tile className="all-groups__group-tile-container__tile">
      <div className="all-groups__group-tile-container__tile-content">
        {isLoading ? (
          <SkeletonText heading width="150px" />
        ) : (
          <h2>{group.name}</h2>
        )}
        {!isLoading && moderator ? (
          <p>
            Created by:{" "}
            <a href={`/profile/${moderator._id}`}>{moderator.name}</a>
          </p>
        ) : (
          <SkeletonText width="150px" />
        )}
        <div className="all-groups__group-tile-container__tile__tags">
          {isLoading
            ? [...Array(5).keys()].map((_, i) => <TagSkeleton key={i} />)
            : interests
                .sort()
                .map((interest, i) => <Tag key={i}>{interest}</Tag>)}
        </div>
        {isLoading ? (
          <SkeletonText lineCount={3} width="150px" />
        ) : (
          <p>{group.description}</p>
        )}
      </div>
      <div className="all-groups__group-tile-container__tile-actions">
        {!isLoading && moderator && userId === moderator._id ? (
          <>
            <Button hasIconOnly kind="tertiary" renderIcon={Edit16} />
            <Button kind="danger">Delete group</Button>
          </>
        ) : (
          <Button kind="tertiary">Join group</Button>
        )}
      </div>
    </Tile>
  );
};

type GroupListParams = {
  matches?: (group: Group /* interest?: String */) => boolean;
};

const GroupList = ({ matches }: GroupListParams) => {
  const { id: userId, token } = AuthApi.authentication();

  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<Group[]>([]);
  const filteredGroups = matches
    ? groups.filter(group => matches(group))
    : groups;

  useEffect(() => {
    const fetchAllGroups = async () => await GroupApi.listAllGroups(token);
    fetchAllGroups()
      .then(groups => {
        setGroups(groups);
        setIsLoading(false);
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  }, [token, setIsLoading, setGroups]);

  return (
    <div className="all-groups">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="all-groups__group-tile-container">
          {filteredGroups.map((group, i) => (
            <GroupTile
              key={i}
              userId={userId}
              token={token}
              group={group}></GroupTile>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupList;
