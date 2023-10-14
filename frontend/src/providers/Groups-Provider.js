import React, { useState } from 'react';
import { GroupsContext } from '../context/context';
import CreateSchedule from '../Features/create-schedule';
import Calendar from '../components/Calendar';

const GroupsProvider = () => {
  const [groups, setGroups] = useState(undefined);

  const updateGroups = (newGroup) => {
    setGroups(newGroup);
  };

  return (
    <GroupsContext.Provider value={{ groups, updateGroups }}>
      <CreateSchedule />
      <Calendar />
    </GroupsContext.Provider>
  );
};

export default GroupsProvider;
