import React, { useState, useCallback, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  MoreHorizontal,
  Copy,
  Trash2,
  Type,
  LayoutGrid,
  Image,
  Video,
  Square,
  Circle,
  Triangle,
  Star,
  Heart,
  MessageSquare,
  Globe,
  Settings,
  Code,
  FileText,
  Layers,
  Component,
  Container,
  Box
} from 'lucide-react';
import { useAppStore } from '../../store';
import { useShallow } from 'zustand/react/shallow';
import { ComponentConfig } from '../../types';
import { ItemSelector } from '../../lib/data/get-item';
import { scrollIntoView } from '../../lib/scroll-into-view';
import { getFrame } from '../../lib/get-frame';
import { onScrollEnd } from '../../lib/on-scroll-end';
import { ZoneStoreContext } from '../DropZone/context';
import { useContextStore } from '../../lib/use-context-store';
import { rootDroppableId } from '../../lib/root-droppable-id';
import { SimpleDragDrop, SimpleDropZone } from './SimpleDragDrop';
import styles from './styles.module.css';

const getClassName = (name: string) => styles[name];

// Component type to icon mapping
const getComponentIcon = (type: string) => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    // Layout
    'section': Container,
    'container': Box,
    'column': LayoutGrid,
    'row': LayoutGrid,
    'grid': LayoutGrid,
    'flex': LayoutGrid,
    
    // Typography
    'heading': Type,
    'text': FileText,
    'paragraph': FileText,
    'title': Type,
    'subtitle': Type,
    
    // Media
    'image': Image,
    'video': Video,
    'gallery': Image,
    'slider': Image,
    'carousel': Image,
    
    // Interactive
    'button': Square,
    'link': Globe,
    'form': Settings,
    'input': Settings,
    'textarea': FileText,
    
    // Content
    'card': Square,
    'hero': Star,
    'banner': Square,
    'testimonial': MessageSquare,
    'quote': MessageSquare,
    'accordion': Triangle,
    'tabs': Triangle,
    
    // E-commerce
    'product': Star,
    'product-list': Star,
    'product-grid': Star,
    'cart': Square,
    'checkout': Settings,
    
    // Social
    'social': Heart,
    'share': Heart,
    'follow': Heart,
    
    // Utility
    'spacer': Circle,
    'divider': Square,
    'break': Square,
    'separator': Square,
    
    // Advanced
    'shortcode': Code,
    'html': Code,
    'script': Code,
    'style': Settings,
    'custom': Component,
    
    // Default
    'default': Component
  };
  
  return iconMap[type.toLowerCase()] || iconMap['default'];
};


interface ModernLayerProps {
  index: number;
  itemId: string;
  zoneCompound: string;
  depth?: number;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const ModernLayer: React.FC<ModernLayerProps> = ({
  index,
  itemId,
  zoneCompound,
  depth = 0,
  isExpanded = false,
  onToggleExpand
}) => {
  const config = useAppStore((s) => s.config);
  const itemSelector = useAppStore((s) => s.state.ui.itemSelector);
  const dispatch = useAppStore((s) => s.dispatch);
  
  const nodeData = useAppStore((s) => s.state.indexes.nodes[itemId]);
  

  const setItemSelector = useCallback(
    (itemSelector: ItemSelector | null) => {
      dispatch({ type: "setUi", ui: { itemSelector } });
    },
    [dispatch]
  );

  const selectedItemId = useAppStore((s) => s.selectedItem?.props.id);
  const isSelected = selectedItemId === itemId || 
    (itemSelector && itemSelector.zone === rootDroppableId && !zoneCompound);
  
  const previewMode = useAppStore((s) => s.state.ui.previewMode);
  const isPreviewSelected = previewMode === "interactive" && selectedItemId === itemId;
  const zonesForItem = useAppStore(
    useShallow((s) =>
      Object.keys(s.state.indexes.zones).filter(
        (z) => z.split(":")[0] === itemId
      )
    )
  );

  const containsZone = zonesForItem.length > 0;
  const zoneStore = useContext(ZoneStoreContext);
  const isHovering = useContextStore(
    ZoneStoreContext,
    (s) => s.hoveringComponent === itemId
  );

  const childIsSelected = useAppStore((s) => {
    const selectedData = s.state.indexes.nodes[s.selectedItem?.props.id];
    return (
      selectedData?.path.some((candidate) => {
        const [candidateId] = candidate.split(":");
        return candidateId === itemId;
      }) ?? false
    );
  });

  const componentConfig: ComponentConfig | undefined = config.components[nodeData.data.type];
  const label = componentConfig?.["label"] ?? nodeData.data.type.toString();
  const IconComponent = getComponentIcon(nodeData.data.type);

  const handleClick = useCallback(() => {
    if (isSelected) {
      setItemSelector(null);
      return;
    }

    const frame = getFrame();
    const el = frame?.querySelector(`[data-puck-component="${itemId}"]`);

    if (!el) {
      setItemSelector({
        index,
        zone: zoneCompound,
      });
      return;
    }

    scrollIntoView(el as HTMLElement);
    onScrollEnd(frame, () => {
      setItemSelector({
        index,
        zone: zoneCompound,
      });
    });
  }, [isSelected, itemId, index, zoneCompound, setItemSelector]);

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    zoneStore.setState({ hoveringComponent: itemId });
    
    if (previewMode === "interactive") {
      const frame = getFrame();
      const el = frame?.querySelector(`[data-puck-component="${itemId}"]`);
      if (el) {
        el.classList.add('preview-hover');
      }
    }
  }, [zoneStore, itemId, previewMode]);

  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    zoneStore.setState({ hoveringComponent: null });
    
    // Preview mode'da hover efektini kaldır
    if (previewMode === "interactive") {
      const frame = getFrame();
      const el = frame?.querySelector(`[data-puck-component="${itemId}"]`);
      if (el) {
        el.classList.remove('preview-hover');
      }
    }
  }, [zoneStore, previewMode]);


  const handleDuplicate = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "duplicate",
      sourceIndex: index,
      sourceZone: zoneCompound,
    });
  }, [index, zoneCompound, dispatch]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "remove",
      index: index,
      zone: zoneCompound,
    });
  }, [index, zoneCompound, dispatch]);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      itemId,
      zoneCompound,
      index
    }));
    e.dataTransfer.effectAllowed = 'move';
  }, [itemId, zoneCompound, index]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
      const { itemId: draggedItemId, zoneCompound: sourceZone, index: sourceIndex } = dragData;
      
      if (draggedItemId && draggedItemId !== itemId) {
        // Dispatch move action
        dispatch({
          type: "move",
          sourceZone,
          sourceIndex,
          destinationZone: zoneCompound,
          destinationIndex: index
        });
      }
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  }, [itemId, zoneCompound, index, dispatch]);

  return (
    <SimpleDragDrop
      depth={depth}
      isDraggable={true}
      isDroppable={true}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div
        className={getClassName('layer')}
      >
        <div className={getClassName('layer-content')}>
          <div
            className={`${getClassName('layer-item')} ${
              isSelected || isPreviewSelected ? getClassName('layer-item--selected') : ''
            } ${isHovering ? getClassName('layer-item--hovering') : ''} ${
              childIsSelected ? getClassName('layer-item--child-selected') : ''
            }`}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
          {/* Expand/Collapse Button */}
          {containsZone && (
            <button
              className={getClassName('expand-button')}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onToggleExpand?.();
              }}
            >
              <ChevronRight 
                size={18} 
                style={{ 
                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.15s ease'
                }} 
              />
            </button>
          )}

          {/* Component Icon */}
          <div className={getClassName('component-icon')}>
            <IconComponent size={18} />
          </div>

          {/* Component Label */}
          <div className={getClassName('component-label')}>
            <span className={getClassName('component-name')}>{label}</span>
            <span className={getClassName('component-type')}>{nodeData.data.type}</span>
          </div>

          {/* Actions */}
          <div className={getClassName('layer-actions')}>
            <button
              className={getClassName('action-button')}
              onClick={handleDuplicate}
              title="Duplicate"
            >
              <Copy size={18} />
            </button>

            <button
              className={getClassName('action-button')}
              onClick={handleDelete}
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

      </div>

      {/* Nested Zones */}
      {containsZone && isExpanded && (
        <div className={getClassName('nested-zones')}>
          {zonesForItem.map((subzone) => (
            <ModernLayerTree
              key={subzone}
              zoneCompound={subzone}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
    </SimpleDragDrop>
  );
};

interface ModernLayerTreeProps {
  zoneCompound: string;
  label?: string;
  depth?: number;
}

const ModernLayerTree: React.FC<ModernLayerTreeProps> = ({
  zoneCompound,
  label: _label,
  depth = 0
}) => {
  const [expandedZones, setExpandedZones] = useState<Set<string>>(new Set());
  const dispatch = useAppStore((s) => s.dispatch);

  const label = useAppStore((s) => {
    if (_label) return _label;

    if (zoneCompound === rootDroppableId) return;

    const [componentId, slotId] = zoneCompound.split(":");
    const componentType = s.state.indexes.nodes[componentId]?.data.type;
    const configForComponent =
      componentType && componentType !== 'root'
        ? s.config.components[componentType]
        : s.config.root;

    return configForComponent?.fields?.[slotId]?.label ?? slotId;
  });

  const contentIds = useAppStore(
    useShallow((s) =>
      zoneCompound ? s.state.indexes.zones[zoneCompound]?.contentIds ?? [] : []
    )
  );

  const toggleZone = useCallback((zoneId: string) => {
    setExpandedZones(prev => {
      const newSet = new Set(prev);
      if (newSet.has(zoneId)) {
        newSet.delete(zoneId);
      } else {
        newSet.add(zoneId);
      }
      return newSet;
    });
  }, []);

  const handleDropZoneDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
      const { itemId: draggedItemId, zoneCompound: sourceZone, index: sourceIndex } = dragData;
      
      if (draggedItemId) {
        // Dispatch move action to drop zone
        dispatch({
          type: "move",
          sourceZone,
          sourceIndex,
          destinationZone: zoneCompound,
          destinationIndex: dropIndex
        });
      }
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
  }, [zoneCompound, dispatch]);

  return (
    <div className={getClassName('layer-tree')}>
      {label && (
        <div className={getClassName('zone-title')}>
          <Layers size={18} />
          <span>{label}</span>
        </div>
      )}
      
      <div className={getClassName('layer-list')}>
        {contentIds.length === 0 && (
          <div className={getClassName('empty-state')}>
            <div className={getClassName('empty-icon')}>
              <Component size={22} />
            </div>
            <span>No components</span>
          </div>
        )}
        
        {contentIds.map((itemId, i) => (
          <React.Fragment key={itemId}>
            {/* Drop zone before each item */}
            <SimpleDropZone
              depth={depth}
              isEmpty={false}
              onDrop={(e) => handleDropZoneDrop(e, i)}
            />
            <ModernLayer
              index={i}
              itemId={itemId}
              zoneCompound={zoneCompound}
              depth={depth}
              isExpanded={expandedZones.has(itemId)}
              onToggleExpand={() => toggleZone(itemId)}
            />
          </React.Fragment>
        ))}
        {/* Drop zone after all items */}
        <SimpleDropZone
          depth={depth}
          isEmpty={contentIds.length === 0}
          onDrop={(e) => handleDropZoneDrop(e, contentIds.length)}
        />
      </div>
    </div>
  );
};

export const ModernOutline: React.FC = () => {
  const outlineOverride = useAppStore((s) => s.overrides.outline);
  const rootZones = useAppStore(
    useShallow((s) => {
      // Import the function dynamically to avoid circular dependency
      const { findZonesForArea } = require('../../lib/data/find-zones-for-area');
      return findZonesForArea(s.state, "root");
    })
  );

  const Wrapper = useMemo(() => outlineOverride || "div", [outlineOverride]);

  return (
    <Wrapper>
      <div className={getClassName('outline-container')}>
        <div className={getClassName('outline-content')}>
          {rootZones.map((zoneCompound: string) => (
            <ModernLayerTree
              key={zoneCompound}
              label={rootZones.length === 1 ? "" : zoneCompound.split(":")[1]}
              zoneCompound={zoneCompound}
            />
          ))}
        </div>
      </div>
    </Wrapper>
  );
};
