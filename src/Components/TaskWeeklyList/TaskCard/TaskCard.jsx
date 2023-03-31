import React from 'react';
import styled, { css } from 'styled-components';
import { PRIORITIES } from '../../../Constants/Priorities';
import { useDrag } from 'react-dnd';

const Card = styled.div`
  border: 1px solid whitesmoke;
  border-radius: 12px;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.25);
  padding: 12px;
  margin: 12px;

  ${props => (
    props.isDragging ?
      css`background-color: #444444;` :
      props.isCompleted ?
        css`background-color: #005700;` :
        props.priority === PRIORITIES.High ?
          css`background-color: darkred;` :
          props.priority === PRIORITIES.Medium ?
            css`background-color: #8b7000;` :
            props.priority === PRIORITIES.Low ?
              css`background-color: #004e7c;` :
              '')
  }   
`;

const Cardheading = styled.h4`
  text-overflow: ellipsis;
  overflow: hidden;
`;

const ControlLink = styled.a`
  text-decoration: none;
  color: white;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: inline-block;
  border: 2px solid white;
  padding: 7px;
  margin: 5px;

  &: hover, &: focus, &:active {
  color: white;
}

  &:hover {
  background - color: rgba(255, 255, 255, 0.2);
}
`;

export default function TaskCard({ task, setDraggedCard, handleComplete, handleDelete, handleMove }) {

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'Card',
    collect: (monitor) => {
      const isDragging = !!monitor.isDragging();
      if (isDragging) {
        setDraggedCard(String(task.createdAt));
      }
      return {
        isDragging,
      }
    }
  }));

  const completeClicked = (event) => {
    event.preventDefault();
    handleComplete(String(task.createdAt));
  }

  const deleteClicked = (event) => {
    event.preventDefault();
    handleDelete(String(task.createdAt));
  }

  const upClicked = (event) => {
    event.preventDefault();
    handleMove(String(task.createdAt), -1); // -1 means up 
  }

  const downClicked = (event) => {
    event.preventDefault();
    handleMove(String(task.createdAt), 1); // 1 means down 
  }

  //<Cardheading title={task.taskName}>{task.taskName}</Cardheading>

  return (
    <Card
      ref={drag}
      priority={task.priority}
      isCompleted={task.isCompleted}
      isDragging={isDragging}>
      <Cardheading title={task.taskName}>{task.taskName}</Cardheading>
      <p className="duration-p">Duration: {task.duration}</p >
      <p className="priority-p">Priority: {task.priority}</p>
      <p className="controls-p">
        <ControlLink className="control-link" href="#" title="Complete Task!" onClick={completeClicked}>
          ✔
        </ControlLink>
        <ControlLink className="control-link" href="#" title="Delete Task!" onClick={deleteClicked}>
          🗑
        </ControlLink>
        <ControlLink className="control-link" href="#" title="Move Task Up!" onClick={upClicked}>
          🠕
        </ControlLink>
        <ControlLink className="control-link" href="#" title="Move Task Down!" onClick={downClicked}>
          🠗
        </ControlLink>
      </p>
    </Card >
  );
}
