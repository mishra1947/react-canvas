import React, { Fragment, useRef, useEffect } from "react";

const fabric = window.fabric;

const DesignCanvas = ({ dimensions, data }) => {
  console.log(dimensions, data);
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  useEffect(() => {
    fabricCanvasRef.current = new fabric.Canvas(canvasRef.current);
  }, []);

  useEffect(() => {
    if (data && data.children && data.children.length) {
      let objects = [];
      data.children.forEach((item) => {
        let newDimensions = calculateDimensions({ height: data.height, width: data.width }, dimensions, item);
        let config = { ...newDimensions };
        if (item.subType === "TEXT") {
          config = { ...getTextConfig(item), ...config };
        } else if (item.subType === "IMAGE") {
          config = { ...getImageConfig(item), ...config };
        } else if (item.subType === "CUSTOM_SHAPE") {
          config = { ...getCustomShape(item), ...config };
        }
        objects.push(config);
      });
      console.log(objects);
      fabricCanvasRef.current.loadFromJSON(
        JSON.stringify({ objects }),
        fabricCanvasRef.current.renderAll.bind(fabricCanvasRef.current)
      );
    }
  }, [data, dimensions]);

  const getTextConfig = (item) => {
    return {
      fontStyle: item.fontStyle,
      textAlign: item.textAlign.trim().toLowerCase(),
      fontFamily: item.fontFamily.trim(),
      scaleX: item.scaleX,
      scaleY: item.scaleY,
      fill: item.color,
      fontSize: item.fontSize,
      opacity: item.opacity,
      visible: item.visible,
      lineHeight: item.lineHeight,
      text: item.text,
      type: "text",
      angle: item.rotation,
      name: item.name,
    };
  };
  const getImageConfig = (item) => {
    return {
      scaleX: item.scaleX,
      scaleY: item.scaleY,
      fill: item.fill,
      opacity: item.opacity,
      visible: item.visible,
      src: item.exportedAsset,
      type: "image",
      angle: item.rotation,
      name: item.name,
    };
  };

  const getCustomShape = (item) => {
    return {
      scaleX: item.scaleX,
      scaleY: item.scaleY,
      fill: item.color,
      opacity: item.opacity,
      visible: item.visible,
      type: "rect",
      angle: item.rotation,
      name: item.name,
    };
  };

  const calculateAspectRatioFit = (srcWidth, srcHeight, maxWidth, maxHeight) => {
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return { width: srcWidth * ratio, height: srcHeight * ratio };
  };

  const calculateDimensions = (originalDimension, dimensions, data) => {
    const { x, y, height, width, subType, fontSize } = data;
    let xPer = x / originalDimension.width;
    let yPer = y / originalDimension.height;
    let hPer = height / originalDimension.height;
    let wPer = width / originalDimension.width;
    let newDimensions = {
      left: xPer * dimensions.width,
      top: yPer * dimensions.height,
      height: hPer * dimensions.height,
      width: wPer * dimensions.width,
    };
    if (subType === "TEXT" && fontSize) {
      newDimensions.fontSize = newDimensions.width * (fontSize / originalDimension.width);
    }
    if (subType === "IMAGE") {
      let originalAspectRatio = width / height;
      let newAspectRatio = newDimensions.width / newDimensions.height;
      if (newDimensions.height > newDimensions.width) {
        let nHeight = newDimensions.height * (newAspectRatio / originalAspectRatio);
        newDimensions.top = newDimensions.top + (newDimensions.height - nHeight) / 2;
        newDimensions.height = nHeight;
      } else {
        let nWidth = newDimensions.width * (originalAspectRatio / newAspectRatio);
        newDimensions.left = newDimensions.left + (newDimensions.width - nWidth) / 2;
        newDimensions.width = nWidth;
      }
    }
    return newDimensions;
  };

  const download = (text, filename, contentType = "data:text/html;charset=utf-8,") => {
    var element = document.createElement("a");
    element.setAttribute("href", contentType + encodeURIComponent(text));
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  return (
    <Fragment>
      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={(e) => {
            e.preventDefault();
            download(JSON.stringify(fabricCanvasRef.current.toJSON()), "file.json");
          }}
        >
          To JSON
        </button>
      </div>
      <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height} style={{ border: "1px solid" }} />
    </Fragment>
  );
};

export default DesignCanvas;
