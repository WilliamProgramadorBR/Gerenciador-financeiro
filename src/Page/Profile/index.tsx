import React, { useState, useEffect, useRef } from 'react';
import {
  ProfileContainer,
  ProfileImage,
  ImageInput,
  PreviewContainer,
  ConfirmButton,
  FormGroup,
  Label,
  Input,
  SaveButton,
} from './styles';

const Profile: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setPreviewImage(base64Image);
        setIsPreviewing(true);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleConfirmImage = async () => {
    if (!previewImage) return;

    // Recupera o usuário do localStorage
    const user = JSON.parse(localStorage.getItem('@minha-carteira:user') || '{}');
    const userId = user.id; // Obtém o ID do usuário

    if (!userId) {
      console.error('ID do usuário não encontrado');
      return;
    }

    const formData = new FormData();
    formData.append('profile_picture', fileInputRef.current!.files![0]);

    try {
      const response = await fetch(`http://localhost:3008/api/upload-profile-picture?userId=${userId}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setImage(data.filePath); // Atualiza o caminho da imagem no estado
        setIsPreviewing(false);

        // Atualiza o caminho da imagem no localStorage
        user.profile_picture = data.filePath;
        localStorage.setItem('@minha-carteira:user', JSON.stringify(user));
      } else {
        console.error('Falha ao fazer upload da imagem');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleCancelPreview = () => {
    setPreviewImage(null);
    setIsPreviewing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch('http://localhost:3008/api/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('@minha-carteira:user', JSON.stringify(user));
      } else {
        console.error('Erro ao atualizar o perfil');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const loadProfileData = () => {
    const user = JSON.parse(localStorage.getItem('@minha-carteira:user') || '{}');
    setImage(user.profile_picture || 'https://via.placeholder.com/150');
    setFormData({
      username: user.username || '',
      email: user.email || '',
      password: user.password || '',
      name: user.name || '',
    });
  };

  useEffect(() => {
    loadProfileData();
  }, []);
  const fetchProfileImage = async () => {
    const user = JSON.parse(localStorage.getItem('@minha-carteira:user') || '{}');
    const userId = user.id;
  
    if (!userId) {
      console.error('ID do usuário não encontrado');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3008/api/get-profile-picture?userId=${userId}`);
      if (response.ok) {
        // Cria um URL de objeto a partir da resposta
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setImage(imageUrl);
      } else {
        console.error('Falha ao buscar a imagem do perfil');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };
  
  useEffect(() => {
    loadProfileData();
    fetchProfileImage();
  }, []);
  
  
  return (
    <ProfileContainer>
      <h2>Profile Settings</h2>
      <ProfileImage
        src={image || 'https://via.placeholder.com/150'}
        alt="Profile"
        onClick={handleImageClick}
      />
      <ImageInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />

      {isPreviewing && (
        <PreviewContainer>
          <h3>Preview</h3>
          <ProfileImage src={previewImage || 'https://via.placeholder.com/150'} alt="Preview" />
          <ConfirmButton onClick={handleConfirmImage}>Confirm</ConfirmButton>
          <SaveButton onClick={handleCancelPreview}>Cancel</SaveButton>
        </PreviewContainer>
      )}

      <form>
        <FormGroup>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </FormGroup>
        <SaveButton type="button" onClick={handleSaveChanges}>Save Changes</SaveButton>
      </form>
    </ProfileContainer>
  );
};

export default Profile;
