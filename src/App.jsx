import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [name,setName]= useState('');
  const [dateTime,setDateTime]= useState('');
  const [description, setDescription] = useState('');
  const [transactions,setTransactions] = useState([]);
  const [money,setMoney] = useState(0);

  
  useEffect(()=>{
    getTransactions().then(transactions => {
      setTransactions(transactions);
    
      let totalMoney = 0;
      transactions.forEach(transaction => {
        if (parseInt(transaction.price) > 0) {
          totalMoney += transaction.price;
        } else {
          totalMoney -= transaction.price;
        }
      });
    
      setMoney(totalMoney); // Update the state once after computing the total
    });
    
  },[])

  async function getTransactions(){
    const res = await fetch(import.meta.env.VITE_API_URL_GET)
    const response = await res.json()
    return response
  }

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const url = import.meta.env.VITE_API_URL;
    console.log(url);
    const price = name.split(' ')[0]
  
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: name.substring(price.length+1)
        ,price, description, dateTime }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Result:', data);

        setTransactions((prevTransactions) => [...prevTransactions, data]);

        setMoney((prevMoney) => prevMoney + data.price); // Update money total
        
        setDateTime('')
        setDescription('')
        setName('')
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      
  };
  

  return (
    <main>
      <h1>${money}<span>.00</span></h1>
      <form onSubmit={handleSubmit}>
      <div className='basics'>
        <input 
          type='text' 
          placeholder='$200 for tv' 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        
        <input 
          type='datetime-local' 
          placeholder='' 
          value={dateTime} 
          onChange={(e) => setDateTime(e.target.value)} 
        />
      </div>
        <input type="text" value={description}
        onChange={(e) => setDescription(e.target.value)}
        />
        <button type='submit'>Add new Transaction</button>
      </form>

      <div className='transactions'>
        {transactions.length > 0 &&
          transactions.map((transaction, index) => (
            <div className='transaction' key={index}>
              <div className='left'>
                <div className='name'>{transaction.name}</div>
                <div className='description'>{transaction.description}</div>
              </div>
              <div className='right'>
                <div className={'price ' + (transaction.price < 0 ? 'red' : 'green')}>
                  {transaction.price}
                </div>
                <div className='datetime'>{transaction.dateTime}</div>
              </div>
            </div>
          ))}
      </div>

    </main>
  );
}


export default App
