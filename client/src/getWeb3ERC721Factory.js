import getWeb3 from "./getWeb3";
import ERC721Factory from "./contracts/ERC721Factory.json";

const getWeb3ERC721Factory = async () => {
    try {
        const web3 = await getWeb3();
        const networkId = await web3.eth.net.getId();
        
        console.log(networkId);
        const deployedNetwork = ERC721Factory.networks[networkId];
        console.log(deployedNetwork);
        const instanceContract = new web3.eth.Contract(
            ERC721Factory.abi,
            deployedNetwork && deployedNetwork.address,
        );

        const accounts = await web3.eth.getAccounts();

        return [instanceContract, accounts];
    } catch (error) {
        alert(`Failed to load web3, accounts, or contract. Check console for details.`);
        console.error(error);
    }
};

export default getWeb3ERC721Factory;