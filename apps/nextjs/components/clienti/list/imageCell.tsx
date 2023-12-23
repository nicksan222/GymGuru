import React from "react";
import { Avatar, AvatarImage } from "#/components/ui/avatar";

interface ImageCellProps {
  firstName: string;
  lastName: string;
}

const ImageCell: React.FC<ImageCellProps> = React.memo(
  ({ firstName, lastName }) => (
    <Avatar className="h-9 w-9">
      <AvatarImage
        src={`https://ui-avatars.com/api/?name=${firstName} ${lastName}`}
        alt="Avatar"
      />
    </Avatar>
  ),
);

ImageCell.displayName = "ImageCell";

export default ImageCell;
