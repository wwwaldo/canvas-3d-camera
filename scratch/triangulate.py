# triangulate the faces of the dodecahedron model (pretty janky if you ask me)

# original face list from http://people.sc.fsu.edu/~jburkardt/data/ply/ply.html
faces = """5 1 2 18 11 14 
5 1 13 7 17 2 
5 3 4 19 8 15 
5 3 16 12 0 4 
5 3 15 6 5 16 
5 1 14 5 6 13 
5 2 17 9 10 18 
5 4 0 10 9 19 
5 7 8 19 9 17 
5 6 15 8 7 13 
5 5 14 11 12 16 
5 10 0 12 11 18 """

def parse_faces(faces):
    parsed = []
    
    faces_split = faces.splitlines()
    for face in faces_split:
        parsed_face = [int(vert) for vert in face.split(' ')[1:-1]]
        parsed.append(parsed_face)
    return parsed

# broke-ass O(n) triangulation
# assumes verts are labelled adjacently
def triangulate(verts):
    triangles = []
    pivot = verts[0]
    for i in range(1, len(verts) - 1):
        triplet = [3, pivot, verts[i], verts[i + 1]] # PLY formatting
        triangles += [triplet]
    return triangles

if __name__ == '__main__':

    all_verts = parse_faces(faces)

    all_triangles = []
    for vert in all_verts:
        all_triangles += triangulate(vert)

    # Finally, format the string
    template = ""
    for i, triangle in enumerate(all_triangles):
        s = f"\"{i}\": {triangle},\n"
        template += s

    print(template)