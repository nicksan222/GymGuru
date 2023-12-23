import React from "react";
import { Avatar, AvatarImage } from "#/components/ui/avatar";

interface ImageCellProps {
  url: string;
}

const ImageCell: React.FC<ImageCellProps> = React.memo(({ url }) => (
  <Avatar className="h-9 w-9">
    <AvatarImage src={`${url}`} alt="Avatar" />
  </Avatar>
));

ImageCell.displayName = "ImageCell";

export default ImageCell;
