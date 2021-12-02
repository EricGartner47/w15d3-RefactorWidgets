import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {useState, useRef, useEffect} from "react"


const AutoComplete = ({names}) => {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     inputVal: '',
  //     showList: false
  //   };
  //   this.inputRef = React.createRef();
  // }
  const [inputVal, setInputVal] = useState('')
  const [showList, setShowList] = useState(false)
  const inputRef = useRef()

  useEffect(()=>{
    if (showList) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      console.log("Removing Autocomplete listener on update!");
      document.removeEventListener('click', handleOutsideClick);
    }
    console.log("Cleaning up event listener from Autocomplete!");
    return document.removeEventListener('click', handleOutsideClick);

  }, [showList])
  // componentDidUpdate() {
  // }

  // componentWillUnmount () {
  // }

  const handleInput = (e) => {
    setInputVal(e.target.value);
  }

  const selectName = ({ target:  { innerText: name }}) => {
    setInputVal(name);
    setShowList(false)
  }

  // Set focus to input field if user clicks anywhere inside the Autocomplete
  // section (unless they have selected a name from the dropdown list)
  const handleAutocompleteSectionClick = ({ target }) => {
    if (!target.classList.contains("nameLi")) {
      inputRef.current.focus();
    }
  }

  const handleOutsideClick = () => {
    // Leave dropdown visible as long as input is focused
    if (document.activeElement === inputRef) return;
    else setShowList(false);
  }

  const matches = () => {
    // const { inputVal } = inputVal;
    // const { names } = names;
    const inputLength = inputVal.length;
    const matches = [];

    if (inputLength === 0) return names;

    names.forEach(name => {
      const nameSegment = name.slice(0, inputLength);
      if (nameSegment.toLowerCase() === inputVal.toLowerCase()) {
        matches.push(name);
      }
    });

    if (matches.length === 0) matches.push('No matches');

    return matches;
  }


    const results = matches().map((result) => {
      const nodeRef = React.createRef();
      return (
        <CSSTransition
          nodeRef={nodeRef}
          key={result}
          classNames="result"
          timeout={{ enter: 500, exit: 300 }}
        >
          <li ref={nodeRef} className="nameLi" onClick={selectName}>
            {result}
          </li>
        </CSSTransition>
      )
    });

    return (
      <section
        className="autocomplete-section"
        onClick={handleAutocompleteSectionClick}
      >
        <h1>Autocomplete</h1>
        <div className="auto">
          <input
            placeholder="Search..."
            ref={inputRef}
            onChange={handleInput}
            value={inputVal}
            onFocus={() => setShowList(true)}
          />
          {showList && (
            <ul className="auto-dropdown">
              <TransitionGroup>
                {results}
              </TransitionGroup>
            </ul>
          )}
        </div>
      </section>
    );
}

export default AutoComplete;
