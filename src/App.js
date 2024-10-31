import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import SimpleStorage from './contracts/SimpleStorage.json';
import './App.css';

function App() {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [storedData, setStoredData] = useState(0);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        const init = async () => {
            try {
                const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
                setWeb3(web3);
                const networkId = await web3.eth.net.getId();
                const deployedNetwork = SimpleStorage.networks[networkId];
                console.log("Network ID:", networkId);
                console.log("Deployed Network:", deployedNetwork);

                if(deployedNetwork) {
                    const instance = new web3.eth.Contract(SimpleStorage.abi, deployedNetwork.address);
                    setContract(instance);
                    const data = await instance.methods.get().call();
                    setStoredData(data);
                } else {
                    console.error('Smart contract not deployed to detected network.');
                }
            } catch (error) {
                console.error("Error initializing web3:", error);
            }
        };
        init();
    }, []);

    const updateData = async () => {
        try {
            const accounts = await web3.eth.getAccounts();
            await contract.methods.set(inputValue).send({ from: accounts[0] });
            const data = await contract.methods.get().call();
            setStoredData(data);
        } catch (error) {
            console.error("Error updating data:", error);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Simple Storage</h1>
                <p>Stored Data: {storedData}</p>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Enter new value"
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <button onClick={updateData}>Update</button>
                </div>
            </header>
        </div>
    );
}

export default App;

