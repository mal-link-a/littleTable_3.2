import { useState, useEffect, FC } from 'react'

import './App.css'

interface ObjectInterface {
  [key: string]: string
}

//Вывели получение api за пределы компонента
const getAPI = (str: string): Promise<ObjectInterface[]> => {
  return fetch(str)
    .then((res) => res.json())
    .then((res) =>
      res.data
    )
    .catch((err) => {
      console.error("error:" + err);
    });
}

enum SortTypes {
  None = 'None',
  Normal = 'Normal',
  Reversed = 'Reversed'
}

function App() {
  const [users, setUsers] = useState<ObjectInterface[]>([]);

  useEffect(() => { getAPI('https://fakerapi.it/api/v1/users?_quantity=30').then(setUsers) }, []);
  return (
    <>
      Табличка
      <div>
        {<Table users={users} />}
      </div>
    </>
  )
}


interface TableProps {
  users: ObjectInterface[]
}
//Таблица
const Table: FC<TableProps> = ({ users }) => {
  //const sortColumn = useRef<number>(0);
  const [sortColumn, setSortColumn] = useState<number>(0);
  const [sortType, setSortType] = useState<SortTypes>(SortTypes.None);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //None не сортируем
  //Normal деф сортировка
  //Reversed обратная сортировка


  

  // Ивент сортировки. Записываем данные для сортировки и инициируем ререндер
  function handleSortClick(value: string) {
    const valueID = userColumns.indexOf(value)
    if (valueID === sortColumn && sortType === SortTypes.Reversed) {
      setSortType(SortTypes.None); 
    } 
    else if (valueID === sortColumn && sortType === SortTypes.None) {
      setSortType(SortTypes.Normal);
    }
    else if (valueID === sortColumn) {
      setSortType(SortTypes.Reversed)
    }
    else {
      setSortColumn(valueID);
      setSortType(SortTypes.Normal); }
  }
  
  if (users.length === 0) {
    return <p>Данных нет</p>
  }
  //Получили дату
  const userColumns = Object.keys(users[0]);

  // Сортировка 
  const sorted = users.sort(function (a, b) {
    const column: string = sortType !== SortTypes.None ? userColumns[sortColumn]: 'id';
    if (a.password.length < 8 && b.password.length < 8) {
      return sortTable(a, b, column);
    }
    if (a.password.length < 8) {
      return 1;
    }
    if (b.password.length < 8) {
      return -1;
    }
    return sortTable(a, b, column);
  }
  );
  //Часть сортировка, отвечающая за сорт по параметрам, записанным в sortColumn и sortType
  function sortTable(a:ObjectInterface, b:ObjectInterface, column: string) {
    const data = (): number => {
      if (a[column] < b[column]) {
        return -1;
      } else { return 1; }
    }
    if (sortType !== SortTypes.Reversed) {
      return data();
    } else { return (data() * -1) }
  }

  //Вычисляем названия столбцов в зависимости от фильтров поиска
  const Strings = (key: string) => {
    if (key === userColumns[sortColumn]) {
      if (sortType === SortTypes.Normal) { return ` ${key}▼`; }
      else if (sortType === SortTypes.Reversed) {
        return ` ${key}▲`;
      }
    }
    return ` ${key} `;
  }

  return (
    <table className='myTable'>
      <thead>
        <tr>{userColumns.map((item) => <th key={`column_${item}`}><button className="sortButton" onClick={() => handleSortClick(item)}>{Strings(item)}</button></th>)}</tr>
      </thead>
      <tbody>
        {sorted.map((item: ObjectInterface) => (
          <tr key={item.id} className={item.password.length < 8 ? "passwordWarning" : ''}>
            {userColumns.map((subItem) => <td key={item[subItem]}>{item[subItem] || '_'}</td>)}
          </tr>))}
      </tbody>
    </table>

  )
}

export default App
