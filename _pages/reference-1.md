---
layout: samples
title: 'Reference Writing Sample #1'
image: ../img/sg-calculate-level-detail-texture-2d-node.png
permalink: /reference/
---

I wrote this reference topic as a part of the Node Library for Shader Graph at Unity Technologies. It lays out the information a user would need to use the node in a Shader Graph file.

# Calculate Level Of Detail Texture 2D node

The Calculate Level of Detail Texture 2D node takes an input Texture 2D and outputs the mip level of a Texture sample. This node is useful in situations where you need to know the mip level of a Texture, such as when you might want to modify the mip level before sampling in your shader.

![An image of the Graph window, that shows a Calculate Level of Detail Texture 2D node.](../img/sg-calculate-level-detail-texture-2d-node.png)

The Calculate Level of Detail Texture 2D node also has a clamped and unclamped mode:

- **Clamped**: The node clamps the returned mip level to the actual mips available on the Texture. The node uses the [`CalculateLevelOfDetail`](https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-to-calculate-lod) HLSL intrinsic function. Use this mode when you want to know which mip to sample your Texture from and restrict the result to an existing mip.

- **Unclamped**: The node returns the ideal mip level, based on an idealized Texture with all its mips present. The node uses the [`CalculateLevelOfDetailUnclamped`](https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-to-calculate-lod-unclamped) HLSL intrinsic function. Use this mode when you need a more generic value for your mip level.

For example, a Texture might only have 3 mips: a 64×64 mip, a 32×32 mip, and a 16×16 mip. When you use the Calculate Level Of Detail Texture 2D node in its **Clamped** mode, the node restricts the **LOD** output to one of the 3 mips on the Texture, even if the ideal mip level might be a smaller resolution, such as an 8×8 version. In its **Unclamped** mode, the node outputs the ideal 8×8 mip level, even though it doesn't exist on the Texture.

| **NOTE** |
| On platforms where these HLSL functions don't exist, Shader Graph determines an appropriate approximation to use, instead.|

## Create Node menu category

The Calculate Level of Detail Texture 2D node is under the **Input** > **Texture** category in the Create Node menu.

## Compatibility

The Calculate Level of Detail Texture 2D node is supported on the following render pipelines:

| **Built-In Render Pipeline** | **Universal Render Pipeline (URP)** |	**High Definition Render Pipeline (HDRP)** |
|Yes |	Yes |	Yes |

This node can only be connected to a Block node in the Fragment Context. For more information on Block nodes and Contexts, see Master Stack.

## Inputs

The Calculate Level of Detail Texture 2D node has the following input ports:

| **Name** 	| **Type** |	**Binding** |	**Description** |
| Texture 	| Texture 2D |	None |	The Texture to use in the mip level calculation.|
| UV 	| Vector 2 	| UV 	| The UV coordinate to use to calculate the Texture's mip level.|
| Sampler |	SamplerState |	None |	The Sampler State and corresponding settings to use to calculate the Texture's mip level.|

## Controls

The Calculate Level of Detail Texture 2D node has one control:

| **Name** |	**Type** |	**Options** |	**Description** |
| Clamp 	| Toggle 	|True, False 	| When enabled, Shader Graph clamps the output mip level to the actual mips present on the provided Texture input. When disabled, Shader Graph returns an ideal mip level, based on an idealized Texture with all its mips present. |

## Outputs

The Calculate Level of Detail Texture 2D node has one output port:

| **Name** |	**Type** |	**Description** |
| LOD 	| Float |	The final calculated mip level of the Texture.|

## Example graph usage

In the following example, a Calculate Level of Detail Texture 2D node calculates the mip level of the Leaves_Albedo Texture for a set of UV coordinates and a specific Sampler State. It sends the calculated mip level for the Texture to the LOD input port on a Sample Texture 2D LOD node, which samples the same Texture:

![An image of the Graph window, that shows a Texture 2D asset node connected to a Calculate Level of Detail Texture 2D node. The node sends the calculated mip level as an input to the LOD input port on a Sample Texture 2D LOD node.](../img/sg-calculate-level-detail-texture-2d-node-example.png)

## Related nodes

The following nodes are related or similar to this node:

- Sample Texture 2D LOD node
- Sampler State node
- Gather Texture 2D node
- Texture 2D Asset node

