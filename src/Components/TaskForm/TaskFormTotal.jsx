import React from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import styled from 'styled-components';

const TaskTotalContainer = styled.div`
  margin: 2rem;
  width: 300px;
  padding: 1rem;
  border: 2px double whitesmoke;
  background-color: black;
`;
const TaskTotalHeading = styled.h3`
  color: white;
  text-align: center;
  padding-bottom: 1rem;
`;

export default function TaskFormTotal(props) {

    return (
        <TaskTotalContainer>(props.count)

            <Form>
                <TaskTotalHeading>Weekly Task Totals</TaskTotalHeading>
                <FormGroup floating>
                    <Input
                        placeholder="Tasks Created">
                    </Input>
                    <Label htmlFor="task-name">Tasks Created:      {props.count[0]}</Label>
                </FormGroup>
                <FormGroup floating>
                    <Input
                        placeholder="Tasks Completed">
                    </Input>
                    <Label htmlFor="task-name">Tasks Completed:     {props.count[1]}</Label>
                </FormGroup>
                <FormGroup floating>
                    <Input
                        placeholder="Tasks Deleted">
                    </Input>
                    <Label htmlFor="task-name">Tasks Deleted:      {props.count[2]}</Label>
                </FormGroup>
            </Form>
        </TaskTotalContainer>
    );
}