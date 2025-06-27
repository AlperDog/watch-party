import React from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable, DraggableProvided, DraggableStateSnapshot, DroppableProvided } from 'react-beautiful-dnd';
import { IoClose, IoReorderThree } from 'react-icons/io5';

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 340px;
  height: 100vh;
  background: #181818;
  box-shadow: -2px 0 16px rgba(0,0,0,0.3);
  z-index: 100;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s;
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 10px 20px;
  border-bottom: 1px solid #222;
`;

const SidebarTitle = styled.h2`
  color: #fff;
  font-size: 18px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: background 0.2s;
  &:hover {
    background: #222;
  }
`;

const PlaylistList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 0 16px 0;
`;

const PlaylistItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  background: #232323;
  border-radius: 8px;
  margin: 0 16px 12px 16px;
  padding: 10px 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: background 0.2s;
`;

const Thumbnail = styled.img`
  width: 72px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  background: #111;
`;

const VideoInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const VideoTitle = styled.div`
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AddedBy = styled.div`
  color: #aaa;
  font-size: 12px;
  margin-top: 2px;
`;

const DragHandle = styled.div`
  color: #888;
  font-size: 22px;
  cursor: grab;
  margin-left: 8px;
`;

const RemoveButton = styled.button`
  background: #ff4d4f;
  border: none;
  color: #fff;
  font-size: 13px;
  border-radius: 6px;
  padding: 4px 10px;
  margin-left: 8px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #d9363e;
  }
`;

interface PlaylistItemType {
  videoId: string;
  title: string;
  addedBy: string;
}

interface PlaylistSidebarProps {
  playlist: PlaylistItemType[];
  username: string;
  onClose: () => void;
  onRemove: (index: number) => void;
  onReorder: (sourceIndex: number, destIndex: number) => void;
}

const getThumbnail = (videoId: string) =>
  `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

const PlaylistSidebar: React.FC<PlaylistSidebarProps> = ({
  playlist,
  username,
  onClose,
  onRemove,
  onReorder,
}) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    if (result.source.index !== result.destination.index) {
      onReorder(result.source.index, result.destination.index);
    }
  };

  return (
    <SidebarContainer>
      <SidebarHeader>
        <SidebarTitle>Playlist</SidebarTitle>
        <CloseButton onClick={onClose}><IoClose /></CloseButton>
      </SidebarHeader>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="playlist-droppable">
          {(provided: DroppableProvided) => (
            <PlaylistList ref={provided.innerRef} {...provided.droppableProps}>
              {playlist.map((item, idx) => (
                <Draggable key={item.videoId + idx} draggableId={item.videoId + idx} index={idx}>
                  {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                    <PlaylistItem ref={provided.innerRef} {...provided.draggableProps} style={provided.draggableProps.style}>
                      <DragHandle {...provided.dragHandleProps}><IoReorderThree /></DragHandle>
                      <Thumbnail src={getThumbnail(item.videoId)} alt={item.title} />
                      <VideoInfo>
                        <VideoTitle>{item.title}</VideoTitle>
                        <AddedBy>Added by {item.addedBy}</AddedBy>
                      </VideoInfo>
                      {item.addedBy === username && (
                        <RemoveButton onClick={() => onRemove(idx)}>Remove</RemoveButton>
                      )}
                    </PlaylistItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </PlaylistList>
          )}
        </Droppable>
      </DragDropContext>
    </SidebarContainer>
  );
};

export default PlaylistSidebar; 