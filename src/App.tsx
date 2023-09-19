/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Grid, HStack, Kbd, Text } from "@chakra-ui/react";
import { KeyboardEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import store, { RootState } from "./App/store";
import { snakeAction } from "./Feature/Snake/SnakeSlice";
import {
  AiOutlineArrowUp,
  AiOutlineArrowDown,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from "react-icons/ai";
import classes from "./App.module.css";

type Position = {
  c: number;
  r: number;
};

function App() {
  const snake = useSelector((state: RootState) => state.snake.value);
  const dispatch = useDispatch();

  const rowSize = 25;
  const colSize = 40;
  const [field, setField] = useState<Position[]>([]);
  const [isStart, setIsStart] = useState(false);
  const [over, setOver] = useState(false);

  const randPos = (max: number): number => {
    return Math.floor(Math.random() * (max - 1)) + 1;
  };

  const delay = (s: number) => {
    return new Promise((resolve) => setTimeout(resolve, s * 1000));
  };

  const createField = () => {
    const tempField: Position[] = [];
    for (let r = 1; r <= rowSize; r++) {
      for (let c = 1; c <= colSize; c++) {
        const position: Position = { c: c, r: r };
        tempField.push(position);
      }
    }
    setField(tempField);
  };

  const initial = () => {
    dispatch(
      snakeAction.newFruitPos({
        c: randPos(colSize),
        r: randPos(rowSize),
      })
    );
    const head = {
      c: randPos(colSize),
      r: randPos(rowSize),
    };
    dispatch(snakeAction.setHead({ c: head.c, r: head.r }));
  };

  useEffect(() => {
    createField();
    initial();
  }, []);

  const keyMove = async (e: KeyboardEvent) => {
    const k = e.key;
    const currentDirect = store.getState().snake.value.direction;
    if (
      k === "ArrowDown" ||
      (k.toLowerCase() === "s" && currentDirect !== "up")
    ) {
      dispatch(snakeAction.setDirection({ direct: "down" }));
      await delay(0.1);
    } else if (
      k === "ArrowUp" ||
      (k.toLowerCase() === "w" && currentDirect !== "down")
    ) {
      dispatch(snakeAction.setDirection({ direct: "up" }));
      await delay(0.1);
    } else if (
      k === "ArrowLeft" ||
      (k.toLowerCase() === "a" && currentDirect !== "right")
    ) {
      dispatch(snakeAction.setDirection({ direct: "left" }));
      await delay(0.1);
    } else if (
      k === "ArrowRight" ||
      (k.toLowerCase() === "d" && currentDirect !== "left")
    ) {
      dispatch(snakeAction.setDirection({ direct: "right" }));
      await delay(0.1);
    }
  };

  const move = async () => {
    while (
      store.getState().snake.value.head.c <= colSize &&
      store.getState().snake.value.head.c > 0 &&
      store.getState().snake.value.head.r <= rowSize &&
      store.getState().snake.value.head.r > 0
    ) {
      const body = store.getState().snake.value.body;
      const head = store.getState().snake.value.head;
      if (
        body
          .slice(0, body.length - 1)
          .some((b) => b.c === head.c && b.r === head.r)
      ) {
        break;
      }
      const currentDirect = store.getState().snake.value.direction;
      // console.log(currentDirect);
      let moveC = 0;
      let moveR = 0;
      switch (currentDirect) {
        case "down":
          moveC = 0;
          moveR = 1;
          break;
        case "up":
          moveC = 0;
          moveR = -1;
          break;
        case "left":
          moveC = -1;
          moveR = 0;
          break;
        case "right":
          moveC = 1;
          moveR = 0;
          break;
        default:
          moveC = 0;
          moveR = 0;
          break;
      }
      const currPosC = store.getState().snake.value.head.c;
      const currPosR = store.getState().snake.value.head.r;
      const fruit = store.getState().snake.value.fruit;
      // console.log(currPosC, currPosR);
      if (currPosC === fruit.c && currPosR === fruit.r) {
        dispatch(snakeAction.increaseBody());
        dispatch(
          snakeAction.newFruitPos({
            c: randPos(colSize),
            r: randPos(rowSize),
          })
        );
      }

      const newPos: Position = {
        c: currPosC + moveC,
        r: currPosR + moveR,
      };
      dispatch(snakeAction.setHead({ c: newPos.c, r: newPos.r }));
      await delay(0.1);
    }
    alert("Game Over");
    setOver(true);
  };

  return (
    <Box
      bg="#232323"
      w="100vw"
      h="100dvh"
      color="#fff"
      tabIndex={0}
      onKeyDown={keyMove}
    >
      <HStack gap={"0.25rem"} className={classes.textGroup}>
        <Text>Pos : c,r</Text>
        <Text>
          Pos head: {snake.head.c},{snake.head.r}
        </Text>
        <Text>
          Pos Fruit: {snake.fruit.c},{snake.fruit.r}
        </Text>
        <Text>Length : {snake.bodyLength}</Text>
        {!isStart && (
          <Button
            onClick={() => {
              if (!isStart) {
                move();
                setIsStart(true);
              }
            }}
          >
            Start
          </Button>
        )}
        {over && (
          <Button
            onClick={() => {
              setOver(false);
              setIsStart(false);
              initial();
              const head = {
                c: randPos(colSize),
                r: randPos(rowSize),
              };
              dispatch(snakeAction.setHead({ c: head.c, r: head.r }));
              dispatch(snakeAction.reset());
            }}
          >
            Reset
          </Button>
        )}
      </HStack>

      <Grid
        templateColumns={`repeat(${colSize},1fr)`}
        border="1px solid #fff2"
        w="fit-content"
        m={"auto"}
      >
        {field.map((i, index) => (
          <Box
            key={index}
            border="1px solid #fff2"
            w={"25px"}
            h="25px"
            fontSize={"0.5rem"}
            bg={
              i.c === snake.head.c && i.r === snake.head.r
                ? "#f009"
                : i.c === snake.fruit.c && i.r === snake.fruit.r
                ? "#0f09"
                : snake.body.some((b) => b.c === i.c && b.r === i.r)
                ? "#00f9"
                : "none"
            }
          >
            {/* {i.c},{i.r} */}
          </Box>
        ))}
      </Grid>
      <HStack
        color="#000"
        w="80vw"
        m="auto"
        my="0.25rem"
        justifyContent={"space-between"}
      >
        <Text display={"flex"} alignItems={"center"} gap={"0.25rem"}>
          <Kbd display={"flex"} alignItems={"center"}>
            W
          </Kbd>
          <Text as="span" color="#fff">
            /
          </Text>
          <Kbd display={"flex"} alignItems={"center"}>
            <AiOutlineArrowUp />
          </Kbd>
          <Text as="span" color="#fff">
            = Up
          </Text>
        </Text>
        <Text display={"flex"} alignItems={"center"} gap={"0.25rem"}>
          <Kbd display={"flex"} alignItems={"center"}>
            S
          </Kbd>
          <Text as="span" color="#fff">
            /
          </Text>
          <Kbd display={"flex"} alignItems={"center"}>
            <AiOutlineArrowDown />
          </Kbd>
          <Text as="span" color="#fff">
            = Down
          </Text>
        </Text>
        <Text display={"flex"} alignItems={"center"} gap={"0.25rem"}>
          <Kbd display={"flex"} alignItems={"center"}>
            A
          </Kbd>
          <Text as="span" color="#fff">
            /
          </Text>
          <Kbd display={"flex"} alignItems={"center"}>
            <AiOutlineArrowLeft />
          </Kbd>
          <Text as="span" color="#fff">
            = Left
          </Text>
        </Text>
        <Text display={"flex"} alignItems={"center"} gap={"0.25rem"}>
          <Kbd display={"flex"} alignItems={"center"}>
            D
          </Kbd>
          <Text as="span" color="#fff">
            /
          </Text>
          <Kbd display={"flex"} alignItems={"center"}>
            <AiOutlineArrowRight />
          </Kbd>
          <Text as="span" color="#fff">
            = Right
          </Text>
        </Text>
      </HStack>
    </Box>
  );
}

export default App;
