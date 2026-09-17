import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import Modal from "./Modal";

const DEFAULT_AVATAR = "https://avatarfiles.alphacoders.com/161/161002.jpg";

const ProfileImage = () => {
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR);
  const [modalOpen, setModalOpen] = useState(false);

  const updateAvatar = (imgSrc: string) => {
    setAvatarUrl(imgSrc);
  };

  return (
    <div className="flex h-12 items-center justify-between rounded-default border border-outline bg-surface-container-lowest px-3 py-2">
      <div className="flex items-center space-x-4">
        <img
          src={avatarUrl}
          alt="Avatar"
          className="h-10 w-10 rounded-lg border-2 border-outline"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setModalOpen(true)}
        >
          <Pencil />
          Choose Image
        </Button>
      </div>

      {modalOpen && (
        <Modal updateAvatar={updateAvatar} closeModal={() => setModalOpen(false)} />
      )}
    </div>
  );
};

export default ProfileImage;
