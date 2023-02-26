import React from 'react';
import styled from 'styled-components';
import { DAYS, getDayIndex } from '../../Constants/Days';
import Swimlane from './Swimlane/Swimlane';

const TaskListContainer = styled.div`
  color: white;
  text-align: center;
`;

const BoardContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 15px;
  @media screen and (max-width: 992px) {
    flex-direction: column;
    align-items: center;
  }
`;

export default function TaskWeeklyList(props) {

  function renderWeek() {
    let jsxList = [];

    for (let day of DAYS) {
      const dayIndex = getDayIndex(day);
      const dailyTaskList = props.taskList[dayIndex];
      jsxList.push(
        <Swimlane
          key={day}
          day={day}
          dailyTaskList={dailyTaskList}
          setDraggedCard={props.setDraggedCard}
          handleDrop={props.handleDrop}
          handleComplete={props.handleComplete}
          handleDelete={props.handleDelete}
          handleMove={props.handleMove}
        />
      );
    }
    return jsxList;
  }

  return (
    <TaskListContainer>
      <h2>Daily Task List</h2>
      <BoardContainer>{renderWeek()}</BoardContainer>
    </TaskListContainer>

  );
}
