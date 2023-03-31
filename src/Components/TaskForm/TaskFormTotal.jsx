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
                        placeholder="Total Tasks" disabled>
                    </Input>
                    <Label htmlFor="task-name">Total Tasks:      {props.count[0]}</Label>
                </FormGroup>
                <FormGroup floating>
                    <Input
                        placeholder="Completed Tasks" disabled>
                    </Input>
                    <Label htmlFor="task-name">Completed Tasks:  {props.count[1]}</Label>
                </FormGroup>
                <FormGroup floating>
                    <Input
                        placeholder="Active Tasks" disabled>
                    </Input>
                    <Label htmlFor="task-name">Active Tasks:     {props.count[2]}</Label>
                </FormGroup>
            </Form>
        </TaskTotalContainer>
    );
}