import update from 'immutability-helper'
import type { FC } from 'react'
import {useCallback, useEffect, useState} from 'react'
import {Card} from "@modules/board/components/board-card/BoardCard";


const style = {
    width: 400,
}

export interface Item {
    id: number
    text: string
}

export interface ContainerState {
    cards: Item[]
}

export const Container: FC = ({column}) => {
    const [cards, setCards] = useState(column.cards)

    useEffect(() => {
        setCards(column.cards)
    }, [column.cards])

    const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
        setCards((prevCards: Item[]) =>
            update(prevCards, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, prevCards[dragIndex] as Item],
                ],
            }),
        )
    }, [])

    const renderCard = useCallback(
        (card: { id: number; text: string }, index: number) => {
            return (
                    <Card
                    key={card.id}
                    index={index}
                    id={card.id}
                    text={card.title}
                    moveCard={moveCard}
                />
            )
        },
        [],
    )

    return (
        <>
            <div style={style}>{cards?.map((card, i) => renderCard(card, i))}</div>
        </>
    )
}
