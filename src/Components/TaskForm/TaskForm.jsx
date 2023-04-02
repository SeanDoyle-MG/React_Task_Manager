import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import styled from 'styled-components';
import { PRIORITIES } from '../../Constants/Priorities';
import { DAYS_DICT as DAYS } from '../../Constants/Days';

const FormContainer = styled.div`
  margin: 2rem;
  width: 900px;
  padding: 1rem;
  border: 2px double whitesmoke;
  background-color: black;
`;

export default function TaskForm(props) {


  const [taskName, setTaskName] = useState('');
  const [duration, setDuration] = useState('');
  const [priority, setPriority] = useState(PRIORITIES.Medium);
  const [day, setDay] = useState(DAYS.Monday);

  function handleSubmit(event) {
    event.preventDefault();
    const newInsertion = {
      item: {
        taskName,
        duration,
        priority,
        isCompleted: false,
        createdAt: new Date().getTime()
      },
      position: day
    }

    props.insertItem(newInsertion);

    setTaskName('');
    setDuration('');
    setPriority(PRIORITIES.Medium);
    setDay(DAYS.Monday);
  }

  function handleTaskNameChange(event) {
    setTaskName(event.target.value);
  }

  function handleDurationChange(event) {
    setDuration(event.target.value);
  }

  function handlePriorityChange(event) {
    setPriority(event.target.value);
  }

  function handleDayChange(event) {
    setDay(event.target.value);
  }

  return (
    <FormContainer action="#" method="GET" onSubmit={handleSubmit}>
      <Form>
        <FormGroup floating>
          <Input
            id="task-name"
            name="task-name"
            required
            placeholder="Task name"
            type="text"
            value={taskName}
            onChange={handleTaskNameChange}></Input>
          <Label htmlFor="task-name">Task name</Label>
        </FormGroup>
        <FormGroup floating>
          <Input
            id="duration"
            name="duration"
            required
            placeholder="Duration"
            type="text"
            value={duration}
            onChange={handleDurationChange}></Input>
          <Label htmlFor="duration">Duration</Label>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="priority" className="text-light">Priority</Label>
          <Input
            id="priority"
            name="priority"
            type="select"
            placeholder="Priority"
            value={priority}
            onChange={handlePriorityChange}
          >
            <option value={PRIORITIES.High}>High</option>
            <option value={PRIORITIES.Medium}>Medium</option>
            <option value={PRIORITIES.Low}>Low</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="day" className="text-light">Day</Label>
          <Input
            id="day"
            name="day"
            type="select"
            placeholder="Day"
            value={day}
            onChange={handleDayChange}
          >
            <option value={DAYS.Sunday}>Sunday</option>
            <option value={DAYS.Monday}>Monday</option>
            <option value={DAYS.Tuesday}>Tuesday</option>
            <option value={DAYS.Wednesday}>Wednesday</option>
            <option value={DAYS.Thursday}>Thursday</option>
            <option value={DAYS.Friday}>Friday</option>
            <option value={DAYS.Saturday}>Saturday</option>
          </Input>
        </FormGroup>
        <Button type="submit">Submit</Button>
      </Form>
    </FormContainer >
  );
}
