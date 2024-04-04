import type { Identifier, XYCoord } from 'dnd-core'
import type {ChangeEvent, FC} from 'react'
import {useRef, useState} from 'react'
import { useDrag, useDrop } from 'react-dnd'
import {ItemTypes} from "@shared/constans";
import {Ticket} from "@shared/types";
import {useMutation} from "react-query";
import {deleteCardById, editCardById, moveCardToColumnById} from "@apis/Card";
import {queryClient} from "@core/http-client";
import styles from "@modules/board/components/board-card/BoardCard.module.scss";
import {
    Card as MuiCard,
    Button,
    CardActions,
    CardContent,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography
} from "@mui/material";
import {Loading} from "@shared/components/loading";

interface DragItem {
    index: number
    id: string
    type: string
}

export interface BoardCardProps {
    item: Ticket;
    id: string;
    index: number;
    moveCard: (dragIndex: number, hoverIndex: number) => void
}

export const BoardCard: FC<BoardCardProps> = ({ item, id, index, moveCard }) => {
    const ref = useRef<HTMLDivElement>(null)
    const [isEditable, setIsEditable] = useState(false);
    const [updatedCard, setUpdatedCard] = useState(item);

    const handleCloseEditModal = () => setIsEditable(false);

    const editCardMutation = useMutation(editCardById, {
        onSuccess: () => {
            queryClient.invalidateQueries('board');
        },
        onSettled: handleCloseEditModal,
    });

    const deleteCardMutation = useMutation(deleteCardById, {
        onSuccess: () => {
            queryClient.invalidateQueries('board');
        },
    });

    const moveCardToColumnMutation = useMutation(moveCardToColumnById, {
        onSuccess: () => {
            queryClient.invalidateQueries('board');
        },
    });

    const [{ handlerId }, drop] = useDrop<
        DragItem,
        void,
        { handlerId: Identifier | null }
    >({
        accept: ItemTypes.CARD,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item: DragItem, monitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = item.index
            const hoverIndex = index

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect()

            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

            // Determine mouse position
            const clientOffset = monitor.getClientOffset()

            // Get pixels to the top
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }

            // Time to actually perform the action
            moveCard(dragIndex, hoverIndex)

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex
        },
    })

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.CARD,
        item: () => {
            return { id, index, columnId: item.columnId }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult<Ticket>();
            if (item && dropResult && dropResult.id !== item.columnId) {
                moveCardToColumnMutation.mutate({
                    columnId: dropResult.id,
                    cardId: item.id,
                });
            }
        },
    })

    const opacity = isDragging ? 0 : 1
    const cursor = isEditable ? 'text' : 'move';
    const disabledFields = editCardMutation.isLoading;

    const handleUpdateCard = (updatedCardDetails: Ticket) => {
        editCardMutation.mutate(updatedCardDetails);
    };

    const handleRemoveCard = () => {
        deleteCardMutation.mutate(item.id);
    };

    const dialogContent = disabledFields ? (
        <Loading />
    ) : (
        <>
            <DialogTitle>Update card info</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    required
                    label="title"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={updatedCard?.title}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setUpdatedCard((_card) => ({ ..._card, title: event.target.value }));
                    }}
                />
                <TextField
                    required
                    label="description"
                    type="text"
                    margin="dense"
                    fullWidth
                    variant="standard"
                    value={updatedCard?.description}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setUpdatedCard((_card) => ({ ..._card, description: event.target.value }));
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseEditModal}>Cancel</Button>
                <Button onClick={() => handleUpdateCard(updatedCard)}>Save</Button>
            </DialogActions>
        </>
    );

    drag(drop(ref))
    return (
        <MuiCard classes={{ root: styles.root }} data-handler-id={handlerId} ref={ref} style={{ opacity, cursor }}>
            <CardContent>
                <Typography variant="h5">{item?.title}</Typography>
                <Typography variant="body2">{item?.description}</Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => setIsEditable(true)}>
                    Edit
                </Button>
                <Button size="small" onClick={handleRemoveCard}>
                    Delete
                </Button>
            </CardActions>
            <Dialog
                fullWidth
                maxWidth={'xs'}
                open={isEditable}
                onClose={() => {
                    if (disabledFields) return;
                    else handleCloseEditModal();
                }}
            >
                {dialogContent}
            </Dialog>
        </MuiCard>
    )
}
