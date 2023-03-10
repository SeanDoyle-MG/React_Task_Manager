import './App.css';
import React, { useState } from 'react';
import TaskForm from './Components/TaskForm/TaskForm';
import TaskFormTotal from './Components/TaskForm/TaskFormTotal';
import TaskWeeklyList from './Components/TaskWeeklyList/TaskWeeklyList';
import { PRIORITIES } from './Constants/Priorities';
import { getDayIndex } from './Constants/Days';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Logo from "./Components/Images/toDoList.png";


function App() {
  // State to store count value
  const [countIns, setCountIns] = useState(4);
  const [countCom, setCountCom] = useState(1);
  const [countDel, setCountDel] = useState(0);
  const count = [];
  const [draggedCard, setDraggedCard] = useState(null);
  const [taskList, setTaskList] = useState([
    [],
    [{
      taskName: 'Learning React',
      duration: '2 hours',
      priority: PRIORITIES.High,
      isCompleted: false,
      createdAt: 1675904343555
    }],
    [],
    [{
      taskName: 'Leetcode exercise in Python',
      duration: '30 minutes',
      priority: PRIORITIES.Medium,
      isCompleted: false,
      createdAt: 1675904412722
    },
    {
      taskName: 'React project state management',
      duration: '4 hours',
      priority: PRIORITIES.Low,
      isCompleted: false,
      createdAt: 1675904412725
    },
    {
      taskName: 'Experiment with Styled Components',
      duration: '1 hour',
      priority: PRIORITIES.Low,
      isCompleted: true,
      createdAt: 1675904412729
    }],
    [],
    [],
    []
  ]);
  const draggedCardRef = React.useRef();
  draggedCardRef.current = draggedCard;


  /********************************HELPER FUNCTIONS****************************/
  // helper function for handleDrop, deletion, and completion
  const findItemByCreatedAt = (createdAt, taskList) => {
    for (let i = 0; i < taskList.length; i++) {
      let dayList = taskList[i];
      for (let j = 0; j < dayList.length; j++) {
        let task = dayList[j];
        if (String(task.createdAt) === String(createdAt)) {
          return {
            item: task,
            dayIndex: i,
            taskIndex: j
          };
        }
      }
    }
    return {
      item: null,
      dayIndex: -1
    };
  }

  // helper function for handleDrop
  const deleteItemFromDayList = (dayList, item) =>
    dayList.filter(task => task !== item);


  /********************************INSERTION***********************************/
  const insertItem = (newInsertion) => {
    // Function to increment count by 1
    const incrementCount = () => {
      // Update state with incremented value
      setCountIns(countIns + 1);
    };
    const dayIndex = getDayIndex(newInsertion.position);
    setTaskList(oldTaskList => {
      const newTaskList = [...oldTaskList];
      newTaskList[dayIndex].push(newInsertion.item);
      incrementCount();
      return newTaskList;
    });
  }

  /********************************DRAG'N'DROP*********************************/
  const handleDrop = (targetDay) => {
    setTaskList(oldTaskList => {
      let newTaskList = [...oldTaskList];
      const { item, dayIndex } = findItemByCreatedAt(draggedCardRef.current, newTaskList);
      if (item === null) {
        return oldTaskList;
      }
      newTaskList[dayIndex] = deleteItemFromDayList(newTaskList[dayIndex], item);
      const targetDayIndex = getDayIndex(targetDay);
      newTaskList[targetDayIndex].push(item);
      return newTaskList;
    });
  }

  /*******************************COMPLETION***********************************/
  const handleComplete = (itemCreatedAt) => {
    setTaskList(oldTaskList => {
      // We need deep cloning, because if we change an item
      // of newItems, without cloning the inner content, the
      // changes will be reflected in the oldItems array too.
      // In Strict Mode, React calls this setter twice with
      // the same oldItems value. If we cange the oldItems
      // value though, the second call will be based on the
      // changed oldItems value, which results in double
      // negation in this case.
      const newTaskList = structuredClone(oldTaskList);
      const { item } = findItemByCreatedAt(itemCreatedAt, newTaskList);
      // Function to increment count by 1
      const incrementCount = () => {
        // Update state with incremented value
        if (item.isCompleted) {
          setCountCom(countCom + 1);
        } else {
          setCountCom(countCom - 1);
        }
      };
      if (item === null) {
        return oldTaskList;
      }
      item.isCompleted = !(item.isCompleted);
      incrementCount();
      return newTaskList;
    });
  }

  /*******************************MOVE*****************************************/
  // direction: -1 is up, +1 is down
  const handleMove = (itemCreatedAt, direction) => {
    setTaskList(oldTaskList => {
      const newTaskList = [...oldTaskList];
      const { item, dayIndex, taskIndex } = findItemByCreatedAt(itemCreatedAt, newTaskList);
      if (
        item === null ||  // impossible if the code is used properly
        (taskIndex === 0 && direction === -1) || // we can't move up 
        (taskIndex >= newTaskList[dayIndex].length - 1 && direction === 1)) {  // we can't move down
        return oldTaskList;
      }
      let otherIndex = taskIndex + direction;
      let swap = newTaskList[dayIndex][taskIndex];
      newTaskList[dayIndex][taskIndex] = newTaskList[dayIndex][otherIndex];
      newTaskList[dayIndex][otherIndex] = swap;
      return newTaskList;
    });
  }


  /*******************************DELETION*************************************/
  const handleDelete = (itemCreatedAt) => {
    setTaskList(oldTaskList => {
      const newTaskList = [...oldTaskList];
      const { item, dayIndex } = findItemByCreatedAt(itemCreatedAt, newTaskList);
      if (item === null) {
        return oldTaskList;
      }
      // Function to increment count by 1
      const incrementCount = () => {
        // Update state with incremented value
        setCountDel(countDel + 1);
      };
      newTaskList[dayIndex] = deleteItemFromDayList(newTaskList[dayIndex], item);
      incrementCount();
      return newTaskList;
    });
  }

  /*******************************Crete an array for weekly task totals*************************************/
  count.push(countIns);
  count.push(countCom);
  count.push(countDel);

  return (
    <div className="App">
      <div className="Container-fluid">
        <div className="image">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="text">
          <h1>Task Management</h1>
        </div>
      </div>
      <main>
        <div className="Task-container">
          <TaskForm insertItem={insertItem} />
          <TaskFormTotal count={count} />
        </div>
        <DndProvider backend={HTML5Backend}>
          <TaskWeeklyList
            taskList={taskList}
            setDraggedCard={setDraggedCard}
            handleDrop={handleDrop}
            handleComplete={handleComplete}
            handleDelete={handleDelete}
            handleMove={handleMove} />
        </DndProvider>
      </main>
      <footer className="App-footer">
        React Project Inspiration from Zsolt Nagy.
        <p>Copyright &copy;2023</p>
      </footer>
    </div >
  );
}

export default App;
