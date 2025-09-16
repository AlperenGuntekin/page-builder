import React, { useState } from 'react';
import { GripVertical } from 'lucide-react';
import styles from './styles.module.css';

const getClassName = (name: string) => styles[name];

interface SimpleDragDropProps {
  children: React.ReactNode;
  depth?: number;
  isDraggable?: boolean;
  isDroppable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  draggable?: boolean;
}

export const SimpleDragDrop: React.FC<SimpleDragDropProps> = ({
  children,
  depth = 0,
  isDraggable = true,
  isDroppable = true,
  onDragStart,
  onDragOver,
  onDrop,
  draggable = true
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart?.(e);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
    onDragOver?.(e);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop?.(e);
  };

  return (
    <div
      className={`${getClassName('simple-drag-drop')} ${
        isDragging ? getClassName('simple-drag-drop--dragging') : ''
      } ${isDragOver ? getClassName('simple-drag-drop--drag-over') : ''}`}
      data-depth={depth}
      draggable={draggable && isDraggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={isDroppable ? handleDragOver : undefined}
      onDragLeave={isDroppable ? handleDragLeave : undefined}
      onDrop={isDroppable ? handleDrop : undefined}
    >
      {/* Drag Handle */}
      {isDraggable && (
        <div className={getClassName('simple-drag-handle')}>
          <GripVertical size={10} />
        </div>
      )}

      {/* Content */}
      <div className={getClassName('simple-drag-content')}>
        {children}
      </div>
    </div>
  );
};

// Simple Drop Zone Component
interface SimpleDropZoneProps {
  depth?: number;
  isEmpty?: boolean;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

export const SimpleDropZone: React.FC<SimpleDropZoneProps> = ({
  depth = 0,
  isEmpty = false,
  onDragOver,
  onDrop
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
    onDragOver?.(e);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop?.(e);
  };

  return (
    <div
      className={`${getClassName('simple-dropzone')} ${
        isEmpty ? getClassName('simple-dropzone--empty') : ''
      } ${isDragOver ? getClassName('simple-dropzone--drag-over') : ''}`}
      data-depth={depth}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={getClassName('simple-dropzone-content')}>
        <div className={getClassName('simple-dropzone-line')} />
      </div>
    </div>
  );
};
