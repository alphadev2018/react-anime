import { useCallback, useEffect, useRef, useState } from 'react';

import './App.css';


const Colors = ['#FF0000', '#00FF00', '#0000FF', '#FF00FF', '#00FFFF', '#FFFF00'];

function Tile({ isExpanded, ...rest }) {
  const dragRef = useRef();
  const clickedRef = useRef();
  const timeoutRef = useRef();

  const onMouseDown = (e) => {
    if (isExpanded) {
      clickedRef.current = e.clientX;
    }
  }

  const onMouseMove = useCallback((e) => {
    if (clickedRef.current) {
      dragRef.current.style.transform = `translateX(${e.clientX - clickedRef.current}px)`;
    }
  }, []);

  const onMouseUp = useCallback(() => {
    clickedRef.current = undefined;
  }, []);

  useEffect(() => {
    if (!isExpanded) {
      clickedRef.current = undefined;
      dragRef.current.style.transform = '';
      timeoutRef.current = setTimeout(() => {
        dragRef.current.style.zIndex = 0;
      }, 500);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    } else {
      clearTimeout(timeoutRef.current);
      dragRef.current.style.zIndex = 1;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  }, [isExpanded, onMouseUp, onMouseMove]);

  return (
    <div
      ref={dragRef}
      className={`tile ${isExpanded ? 'expanded' : 'collapsed'}`}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      {...rest}
    />
  )
}

function Tiles({ count }) {
  const [expandedTile, setExpandedTile] = useState(null);

  return Array
    .from({ length: count })
    .map((_, i) => {
      let top = 8;
      let left = 8;
      let width = window.innerWidth - 16;
      let height = window.innerHeight - 16;

      if (expandedTile !== i) {
        top = window.innerHeight / 2 * Math.floor(i / (count / 2)) + 8;
        height = window.innerHeight / 2 - 16;
        left = window.innerWidth / (count / 2) * (i % (count / 2)) + 8;
        width = window.innerWidth / (count / 2) - 16;
      }

      return (
        <Tile 
          key={i}
          isExpanded={expandedTile === i}
          style={{
            backgroundColor: Colors[i],
            top, left, width, height
          }}
          onClick={() => setExpandedTile(i)}
          onDoubleClick={() => setExpandedTile(null)}
        />
      )}
    );
}

function App() {
  const [count, setCount] = useState(null);

  if (count) {
    return (
      <Tiles count={count} />
    );
  }

  return (
    <div className="App">
      <button className="App-btn" onClick={() => setCount(4)}>4 Tiles</button>
      <button className="App-btn" onClick={() => setCount(6)}>6 Tiles</button>
    </div>
  );
}

export default App;
