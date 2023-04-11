import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './App.css';
import TaskForm from './Components/TaskForm/TaskForm';
import TaskFormTotal from './Components/TaskForm/TaskFormTotal';
import TaskWeeklyList from './Components/TaskWeeklyList/TaskWeeklyList';
import { getDayIndex } from './Constants/Days';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Logo from "./Components/Images/toDoList.png";

const SERVER_URL = 'https://react-api-app.azurewebsites.net';

function App() {
  // State to store count value
  let [countIns, setCountIns] = useState(0);
  let [countCom, setCountCom] = useState(0);
  let [countAct, setCountAct] = useState(0);
  const count = [];
  const [draggedCard, setDraggedCard] = useState(null);
  const [taskList, setTaskList] = useState([
    [],
    [],
    [],
    [],
    [],
    [],
    [],
  ]);

  const loadData = () => {
    // axios
    axios.get(SERVER_URL + '/api/tasks')
      .then((response) => {
        if (Array.isArray(response.data)) {
          const dbCount = (response.data.length);
          setCountIns(dbCount);
          let taskList = [[], [], [], [], [], [], []];
          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          countAct = 0;
          countCom = 0;
          for (let task of response.data) {
            if (task.isCompleted === 0) {
              (countAct = countAct + 1);
            }
            if (task.isCompleted === 1) {
              (countCom = countCom + 1);
            }
            const dayIndex = days.indexOf(task.day); // 0...6
            if (dayIndex >= 0) {
              taskList[dayIndex].push({
                taskName: task.taskName,
                duration: task.duration,
                priority: task.priority,
                dayTaskOrd: task.dayTaskOrd,
                isCompleted: task.isCompleted,
                createdAt: task.createdAt,
              });
            }
          }
          setTaskList(taskList);
          setCountAct(countAct);
          setCountCom(countCom);
        } else {
          setTaskList([]);
        }
      }).catch((error) => {
        setTaskList([]);
      });
  }

  useEffect(loadData, []);

  function addTaskItem(taskName, duration, priority, day, dayTaskOrd, isCompleted, createdAt) {
    axios.post(SERVER_URL + '/api/tasks/new', {
      taskName,
      duration,
      priority,
      day,
      dayTaskOrd,
      isCompleted,
      createdAt
    }).then(loadData);
  }

  function deleteTaskItem(id) {
    axios.delete(SERVER_URL + '/api/tasks/' + id).then(loadData);
  }

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
    // Check for spaces entered by user for Task Name or Task Duration
    var whiteSpace = (/^\s*$/);
    if (whiteSpace.test(newInsertion.item.taskName)) {
      alert('Please enter a Task Name. White space is not allowed');
      return;
    }
    if (whiteSpace.test(newInsertion.item.duration)) {
      alert('Please enter a Task Duration. White space is not allowed');
      return;
    }
    // Function to increment count by 1
    const incrementCountIns = () => {
      // Update state with incremented value
      setCountIns(countIns + 1);
    }
    // Function to increment count by 1
    const incrementCountAct = () => {
      // Update state with incremented value
      setCountAct(countAct + 1);
    }
    const dayIndex = getDayIndex(newInsertion.position);
    setTaskList(oldTaskList => {
      const newTaskList = [...oldTaskList];
      newTaskList[dayIndex].push(newInsertion.item);
      incrementCountIns();
      incrementCountAct();
      addTaskItem(
        newInsertion.item.taskName,
        newInsertion.item.duration,
        newInsertion.item.priority,
        newInsertion.position,
        1,
        0,  // initialize Task to Active Status
        new Date().getTime()
      );
      return newTaskList;
    })
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
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      newTaskList[targetDayIndex].push(item);
      axios.get(SERVER_URL + '/api/tasks')
        .then((response) => {
          let taskToBeUpdated = parseInt(item.createdAt);
          if (Array.isArray(response.data)) {
            for (let task of response.data) {
              if (taskToBeUpdated === task.createdAt) {
                let id = task.id;
                let draggedDay = days[targetDayIndex];
                axios.put(SERVER_URL + '/api/tasks/' + id, {
                  taskName: task.taskName,
                  duration: task.duration,
                  priority: task.priority,
                  day: draggedDay,
                  dayTaskOrd: task.dayTaskOrd,
                  isCompleted: task.isCompleted,
                  createdAt: task.createdAt
                }).then(loadData);
              }
            }
          }
        });
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
      // the same oldItems value. If we change the oldItems
      // value though, the second call will be based on the
      // changed oldItems value, which results in double
      // negation in this case.
      const newTaskList = structuredClone(oldTaskList);
      const { item } = findItemByCreatedAt(itemCreatedAt, newTaskList);
      axios.get(SERVER_URL + '/api/tasks')
        .then((response) => {
          let taskToBeUpdated = parseInt(item.createdAt);
          if (Array.isArray(response.data)) {
            for (let task of response.data) {
              if (taskToBeUpdated === task.createdAt) {
                let id = task.id;
                axios.put(SERVER_URL + '/api/tasks/' + id, {
                  taskName: task.taskName,
                  duration: task.duration,
                  priority: task.priority,
                  day: task.day,
                  dayTaskOrd: task.dayTaskOrd,
                  isCompleted: item.isCompleted,
                  createdAt: task.createdAt
                }).then(loadData);
              }
            }
          }
        });
      // Function to increment count by 1
      const incrementCountCom = () => {
        // Update state with incremented value
        setCountCom(countCom + 1);
      }
      if (item === null) {
        return oldTaskList;
      }
      item.isCompleted = !(item.isCompleted);
      incrementCountCom();
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
      let other = newTaskList[dayIndex][otherIndex];
      newTaskList[dayIndex][taskIndex] = newTaskList[dayIndex][otherIndex];
      newTaskList[dayIndex][otherIndex] = swap;
      let currentDateTime = new Date().getTime();
      let taskToBeUpdated = '';
      axios.get(SERVER_URL + '/api/tasks')
        .then((response) => {
          if (Array.isArray(response.data)) {
            for (let task of response.data) {
              taskToBeUpdated = parseInt(swap.createdAt);
              if (taskToBeUpdated === task.createdAt) {
                let id = task.id;
                axios.put(SERVER_URL + '/api/tasks/' + id, {
                  taskName: other.taskName,
                  duration: other.duration,
                  priority: other.priority,
                  day: task.day,
                  dayTaskOrd: other.dayTaskOrd,
                  isCompleted: other.isCompleted,
                  createdAt: currentDateTime
                }).then(loadData);
              }
            }
          }
        });
      axios.get(SERVER_URL + '/api/tasks')
        .then((response) => {
          if (Array.isArray(response.data)) {
            for (let task of response.data) {
              taskToBeUpdated = parseInt(other.createdAt);
              if (taskToBeUpdated === task.createdAt) {
                let id = task.id;
                axios.put(SERVER_URL + '/api/tasks/' + id, {
                  taskName: swap.taskName,
                  duration: swap.duration,
                  priority: swap.priority,
                  day: task.day,
                  dayTaskOrd: swap.dayTaskOrd,
                  isCompleted: swap.isCompleted,
                  createdAt: swap.createdAt
                }).then(loadData);
              }
            }
          }
        });
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
      newTaskList[dayIndex] = deleteItemFromDayList(newTaskList[dayIndex], item);
      axios.get(SERVER_URL + '/api/tasks')
        .then((response) => {
          let taskToBeDeleted = parseInt(itemCreatedAt);
          if (Array.isArray(response.data)) {
            for (let task of response.data) {
              if (taskToBeDeleted === task.createdAt) {
                let id = task.id;
                deleteTaskItem(id);
              }
            }
          }
        });
      return newTaskList;
    });
  }

  /*******************************Crete an array for weekly task totals*************************************/
  count.push(countIns);
  count.push(countCom);
  count.push(countAct);

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
  )
}

export default App;
