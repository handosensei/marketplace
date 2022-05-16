import React, { useState } from "react";

function MetadataField() {
    
    const [inputList, setInputList] = useState([{ trait_type: "", value: "" }]);
     
    // handle input change
    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputList];
        list[index][name] = value;
        setInputList(list);
    };
    
    // handle click event of the Remove button
    const handleRemoveClick = index => {
        const list = [...inputList];
        list.splice(index, 1);
        setInputList(list);
    };
    
    // handle click event of the Add button
    const handleAddClick = () => {
        setInputList([...inputList, { trait_type: "", value: "" }]);
    };

    return (
        <div>
            {inputList.map((x, i) => {
                return (
                    <div className="row" key={i}>
                        <div className="col-4">
                            <input type="text" name="trait_type" className="form-control" placeholder="Key" value={x.traitType} onChange={e => handleInputChange(e, i)}/>
                        </div>

                        <div className="col-4">
                            <input type="text" name="value" className="form-control" placeholder="Value" value={x.val} onChange={e => handleInputChange(e, i)}/>
                        </div>

                        <div className="col-1">
                            {inputList.length !== 1 && <button type="button" className="btn-main btn-sm" onClick={() => handleRemoveClick(i)}><i className="fa fa-trash"></i></button>}
                        </div>
                        <div className="col-1"></div>
                        <div className="col-1">
                            {inputList.length - 1 === i && <button type="button" className="btn-main btn-sm" onClick={handleAddClick}><i className="fa fa-plus"></i></button>}
                        </div>
                    </div>            
                );
            })}
            <div style={{ marginTop: 20 }}>{JSON.stringify(inputList)}</div>
        </div>
    );
}

export default MetadataField;