import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ImageCropper from "./ImageCropper";

interface ModalProps {
  closeModal: () => void;
  updateAvatar: (imgSrc: string) => void;
  onFileChange?: (file: File) => void;
}

const Modal = ({ closeModal, updateAvatar, onFileChange }: ModalProps) => {
  return (
    <Dialog
      open
      onOpenChange={(next) => {
        if (!next) closeModal();
      }}
    >
      <DialogContent aria-labelledby="crop-image-dialog">
        <DialogHeader>
          <DialogTitle>Crop profile photo</DialogTitle>
          <DialogDescription>Choose a file, adjust the crop, then apply.</DialogDescription>
        </DialogHeader>
        <ImageCropper
          onFileChange={onFileChange}
          updateAvatar={updateAvatar}
          closeModal={closeModal}
        />
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
