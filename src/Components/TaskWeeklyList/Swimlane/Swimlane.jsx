import React from 'react';
import TaskCard from '../TaskCard/TaskCard';
import styled, { css } from 'styled-components';
import { useDrop } from 'react-dnd';

const DayTitle = styled.h3`
  margin: -1px -1px 0 -1px; // border-collapse 
  padding: 18px 0;
  border: 1px solid whitesmoke;
`;

const DayContent = styled.div`
  height: 700px;
  overflow-y: auto;
  @media (max-width: 992px) {
    height: auto;
    min-height: 75px;
  }
`;

const DaySwimlane = styled.div`
  width: 215px;
  margin: 0 -1px 0 0; // border-collapse
  padding-bottom: 18px;
  text-align: center;
  border: 2px solid whitesmoke;
  background-color: black;
  @media screen and (max-width: 992px) {
    width: 576px;
  }
  @media screen and (max-width: 576px) {
    width: 80%;
    min-width: 200px;
  }
  ${props => {
    if (props.isOver) {
      return css`background-color: #444444;`;
    }
  }}
`;

export default function Swimlane({
  day,
  dailyTaskList,
  setDraggedCard,
  handleComplete,
  handleDelete,
  handleMove,
  handleDrop }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'Card',
    drop(_item/*, monitor */) {
      handleDrop(day);
      return undefined
    },
    collect: monitor => ({
      isOver: !!monitor.isOver()
    }),
  }), [])

  function renderDailyTaskList() {
    const jsxList = [];
    for (let task of dailyTaskList) {
      jsxList.push(
        <TaskCard
          task={task}
          key={task.createdAt}
          setDraggedCard={setDraggedCard}
          handleComplete={handleComplete}
          handleDelete={handleDelete}
          handleMove={handleMove} />
      );
    }
    return jsxList;
  }

  return (
    <DaySwimlane isOver={isOver}>
      <DayTitle>{day}</DayTitle>
      <DayContent ref={drop}>
        {renderDailyTaskList(day)}
      </DayContent>
    </DaySwimlane>
  );

}