
//item price
let price = 3.56;
//cid 2D array represents available cash in the drawer
let cid = [
    ['PENNY', 1.01],
    ['NICKEL', 2.05],
    ['DIME', 3.1],
    ['QUARTER', 4.25],
    ['ONE', 90],
    ['FIVE', 55],
    ['TEN', 20],
    ['TWENTY', 60],
    ['ONE HUNDRED', 100]
];

const cash  = document.getElementById("cash"); //amount given by the customer
const change = document.getElementById("change-due"); //Store the span where the results are shown
const purchaseBtn = document.getElementById("purchase-btn"); //purchase button
//hold total money in the machine
let machineMoney;

//update cid total money every time we give back change
const updateAvailableMoney = ()=> {machineMoney = cid.reduce((total, [, amount]) => total + amount, 0)};

//check if there are enough money in the machine
const insufficientMoney = (remainingAmount) =>{return remainingAmount > machineMoney};

function calculateTransaction(itemPrice,customerCash){
    //calculate change
    let remainingAmount = customerCash - itemPrice;
    //check available money in the machine
    updateAvailableMoney();
    if (insufficientMoney(remainingAmount)){
        change.innerText = "Status: INSUFFICIENT_FUNDS";
        return;
    }
    //declare denominations sorted highest to lowest
    const denominations = [
        ["ONE HUNDRED", 100],
        ["TWENTY", 20],
        ["TEN", 10],
        ["FIVE", 5],
        ["ONE", 1],
        ["QUARTER", 0.25],
        ["DIME", 0.1],
        ["NICKEL", 0.05],
        ["PENNY", 0.01],
    ];
    let tempChange = [];  //hold the change we give back on every transaction
    for (let i = 0; i < denominations.length; i++){
        const [valueName,valueQuantity] = denominations[i];
        let available = cid[denominations.length-1-i][1];
        if (remainingAmount >= valueQuantity && available >0){
            let needToTake = Math.floor(remainingAmount/valueQuantity) * valueQuantity;
            //choose an amount that do not exceeds the available
            let actuallyTaken = Math.min(needToTake,available);
            remainingAmount  = +(remainingAmount - actuallyTaken).toFixed(2);
            //update the available quantities for each denomination
            cid[denominations.length-1-i][1] -= actuallyTaken;
            //store to tempChange array the name and value taken
            tempChange.push([valueName,actuallyTaken]);
            updateAvailableMoney();
        }
    }
    if (remainingAmount > 0) { //In this case we still have money in the machine but we cannot return change
        change.innerText = "Status: INSUFFICIENT_FUNDS";
    }else if(remainingAmount === 0 && machineMoney ===0){
        change.innerText = "Status: CLOSED";
        change.innerText += " "+tempChange.map(([name,amount])=>`${name}: $${amount}`);
    }else{
        change.innerText = "Status: OPEN";
        change.innerText += " "+tempChange.map(([name,amount])=>`${name}: $${amount}`);
    }
}

function checkPurchase(itemPrice,customerCash) {
    if (customerCash < itemPrice) {
        alert("Customer does not have enough money to purchase the item");
    }else if (itemPrice ===customerCash){
        change.innerText = "No change due - customer paid with exact cash";
    }else{
        calculateTransaction(itemPrice,customerCash);
    }
}


//On-click, calculateTransaction is called
purchaseBtn.addEventListener("click",()=>{
    checkPurchase(price,parseFloat(cash.value));
});

