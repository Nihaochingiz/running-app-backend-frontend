import './App.css';
import RecordForm from './components/RecordForm';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Running Statistics Tracker 🏃‍♂️📊</h1>
      </header>
      
      <main>
        <RecordForm />
      </main>
      
      <footer className="App-footer">
        <p>© 2024 Running Stats. All rights reserved. Created By Nihaochingiz</p>
      </footer>
    </div>
  );
};

export default App;
