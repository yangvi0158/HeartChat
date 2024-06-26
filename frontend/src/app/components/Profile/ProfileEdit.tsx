import { useState, useRef } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { useRouter } from "next/router";

import { isFileOverSize, isInvalidFileName } from "../../utils/utility";
import styles from "@/app/styles/index.module.sass";
import { colorList, statusList, customStatus } from "@/app/configs/constant";
import "../../styles/component/ProfileEdit.sass";

interface User {
  name: string;
  avatar_color: string;
  description: string;
}

const initData = {
  name: "",
  avatar_color: colorList[0],
  description: statusList[0],
};

const getDescriptionInitValue = (originalData) => {
  if (!originalData) return "";
  if (statusList.includes(originalData.description)) return "";
  return originalData.description;
};

export default function ProfileEdit({
  onSubmit,
  originalImgId = "",
  originalData,
}) {
  const { push } = useRouter();
  const client = new S3Client({
    region: "eu-west-2",
    credentials: {
      secretAccessKey: `${process.env.NEXT_PUBLIC_S3_CREDENTIAL_SECRET_ACCESS_KEY}`,
      accessKeyId: `${process.env.NEXT_PUBLIC_S3_CREDENTIAL_ACCESS_KEY_ID}`,
    },
  });
  const imgInputRef = useRef<null | HTMLInputElement>(null);
  const [imageData, setImageData] = useState<{
    file: File | null;
    url: string;
  }>({
    file: null,
    url: originalImgId
      ? process.env.NEXT_PUBLIC_S3_IMAGE_URL + originalImgId
      : "",
  });
  const [imageErrorTexts, setImageErrorTexts] = useState<string[] | []>([]);
  const [profile, setProfileData] = useState<User>(
    originalData
      ? {
          name: originalData.name,
          avatar_color: originalData.avatar_color,
          description: statusList.includes(originalData.description)
            ? originalData.description
            : customStatus,
        }
      : initData,
  );
  const [customDesc, setCustomDesc] = useState(
    getDescriptionInitValue(originalData),
  );

  console.log("imageData", imageData);
  console.log("profile", profile);
  console.log("customDescription", customDesc);

  const handleSelectColor = (color) => {
    setProfileData((prev) => ({
      ...prev,
      avatar_color: color,
    }));
    removePreviewImage();
    if (imageErrorTexts) setImageErrorTexts([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, description, avatar_color } = profile;
    if (!name) {
      const form = e.target.closest("form");
      form.reportValidity();
      return;
    }
    const imageId = imageData.file
      ? Date.now() + "_" + imageData.file?.name
      : "";

    const payload: any = {
      name,
      avatar_color,
      has_img: Boolean(imageData.url),
      description: description === customStatus ? customDesc : description,
    };
    if (imageData.file) payload.img_id = encodeURIComponent(imageId);
    onSubmit(payload);
    console.log("payload", payload);

    if (imageData.file) handleUploadImage(imageId);
  };

  const removePreviewImage = () => {
    setImageData({
      file: null,
      url: "",
    });
  };

  const previewImage = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const target = evt.target as HTMLInputElement;
    if (target.files && target.files.length) {
      const file = target.files[0];

      const isOverSize = isFileOverSize(file);
      const isInvalidFile = isInvalidFileName(file);

      const imgErrorList: string[] = [];
      if (isOverSize) imgErrorList.push("Please select a file less than 2MB.");
      if (isInvalidFile) imgErrorList.push("File name cannot contain space");

      setImageErrorTexts(imgErrorList);
      if (isOverSize || isInvalidFile) return;

      setImageData({
        file: file,
        url: URL.createObjectURL(file),
      });
      setProfileData((prev) => ({
        ...prev,
        avatar_color: "",
      }));
    }
  };

  const handleUploadImage = async (imageId) => {
    if (!imageData.file) return;
    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: `images/${imageId}`,
      Body: imageData.file,
    });
    try {
      await client.send(command);
    } catch (error) {
      console.log(error);
    }
  };

  const avatarStyle = imageData.url
    ? {
        backgroundImage: `url(${imageData.url})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        border: "solid 2px white",
      }
    : {
        backgroundColor: profile.avatar_color,
      };

  return (
    <form id="profile">
      <Stack
        justifyContent="center"
        alignItems="center"
        className="profileEdit"
      >
        <Stack
          justifyContent="center"
          alignItems="center"
          className="avatar-container"
          style={avatarStyle}
        >
          {!imageData.url && <span>{profile.name[0] || "A"}</span>}
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{
            backgroundColor: "rgba(255,255,255,.03)",
            padding: "10px 15px",
            margin: "20px 0",
            borderRadius: "15px",
          }}
        >
          {colorList.map((color, key) => (
            <Box
              key={key}
              className={`colorItem ${
                profile.avatar_color === color &&
                !imageData.url &&
                `selectedAvatar`
              }
                            `}
              onClick={() => handleSelectColor(color)}
              sx={{
                backgroundColor: color,
              }}
            ></Box>
          ))}
          <Box
            className={`colorItem upload-img ${
              imageData.url && `selectedAvatar`
            }`}
          >
            <input
              ref={imgInputRef}
              title="img-input"
              type="file"
              accept=".gif, .jpg, .png, .jpeg"
              name="image"
              id="file"
              onChange={(e) => {
                previewImage(e);
              }}
            />
            <label
              onClick={() => {
                if (imgInputRef.current) {
                  imgInputRef.current.value = "";
                }
              }}
              htmlFor="file"
              style={{ cursor: "pointer", display: "flex" }}
            >
              <PhotoCameraIcon sx={{ color: "#353E4B", fontSize: 20 }} />
            </label>
          </Box>
        </Stack>
        {imageErrorTexts.length > 0 &&
          imageErrorTexts.map((item) => (
            <span className="text--warn" key={item}>
              -{item}
            </span>
          ))}
        <TextField
          required
          id="outlined-basic"
          label="Display Name"
          variant="filled"
          className="text-field"
          value={profile.name}
          sx={{
            backgroundColor: "#3e4366",
            borderRadius: "10px",
            width: "300px",
            marginTop: "20px",
          }}
          onChange={(e) =>
            setProfileData((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
        />
        {profile.description === customStatus && (
          <TextField
            id="outlined-basic"
            label="Custom Status"
            variant="filled"
            className="text-field"
            value={customDesc}
            sx={{
              backgroundColor: "#3e4366",
              borderRadius: "10px",
              width: "300px",
              marginTop: "20px",
            }}
            onChange={(e) => setCustomDesc(e.target.value)}
          />
        )}
        <div className="description-container">
          {statusList.map((item) => (
            <button
              key={item}
              type="button"
              className={`description-btn ${
                item === profile.description && "selected"
              }`}
              onClick={() => {
                setProfileData((prev) => ({
                  ...prev,
                  description: item,
                }));
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <button
          type="submit"
          form="profile"
          onClick={handleSubmit}
          className={`${styles.button} button`}
        >
          Save
        </button>
        <button
          type="button"
          className="cancel-btn"
          onClick={() => {
            const path = originalData ? "/room/init" : "/";
            push(path);
          }}
        >
          Cancel
        </button>
      </Stack>
    </form>
  );
}
