#version 330 core
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 aNormal;
layout (location = 2) in vec2 aTexCoords;
layout (location = 3) in vec3 aColor;

out vec4 vertexColor;
out vec2 TexCoords;

out vec3 Normal;
out vec3 WorldPos;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main()
{
    // (��MVP����)ע��˷�Ҫ���������
	gl_Position = projection * view * model * vec4(aPos, 1.0f);
	vertexColor = vec4(aColor.x,aColor.y,aColor.z,1.0f);
	TexCoords = aTexCoords;
	WorldPos = vec3(model * vec4(aPos, 1.0));
	Normal = aNormal;
}