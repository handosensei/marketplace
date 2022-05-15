import getWeb3 from "./getWeb3";
import ERC1155Factory from "./contracts/ERC1155Factory.json";

const getWeb3ERC1155Factory = async () => {
    try {
        const web3 = await getWeb3();
        const networkId = await web3.eth.net.getId();
        
        console.log(networkId);
        const deployedNetwork = ERC1155Factory.networks[networkId];
        console.log(deployedNetwork);
        const instanceContract = new web3.eth.Contract(
            ERC1155Factory.abi,
            deployedNetwork && deployedNetwork.address,
        );

        const accounts = await web3.eth.getAccounts();

        return [instanceContract, accounts];
    } catch (error) {
        alert(`Failed to load web3, accounts, or contract. Check console for details.`);
        console.error(error);
    }
};

export default getWeb3ERC1155Factory;