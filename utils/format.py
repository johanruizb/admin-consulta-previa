import os
import re

modified_files = 0
unmodified_files = 0


def convert_quotes(file_path):
    global modified_files, unmodified_files
    with open(file_path, "r", errors="ignore", encoding="utf-8") as file:
        code = file.read()

    if re.search(r"'(.*?)'", code):
        converted_code = re.sub(r"'(.*?)'", r'"\1"', code)

        with open(file_path, "w", errors="ignore", encoding="utf-8") as file:
            file.write(converted_code)
        modified_files += 1
    else:
        unmodified_files += 1


def replace_import(match):
    components = [str(c).strip() for c in match.group(1).split(",")]
    components = [component for component in components if component.strip() != ""]

    imports = "\n".join([f'import {component} from "@mui/joy/{component}";' for component in components])
    return imports


def convert_imports(file_path):
    global modified_files, unmodified_files
    pattern = r"import {([^}]*)} from \"@mui/joy\";"

    with open(file_path, "r", errors="ignore", encoding="utf-8") as file:
        code = file.read()

    if re.search(pattern, code):
        converted_code = re.sub(pattern, replace_import, code)
        with open(file_path, "w", errors="ignore", encoding="utf-8") as file:
            file.write(converted_code)
        modified_files += 1
    else:
        unmodified_files += 1


project_path = [os.path.abspath("components"), os.path.abspath("pages")]

if not os.path.exists(project_path):
    raise Exception("La carpeta del proyecto no existe.")

for path in project_path:
    for root, dirs, files in os.walk(project_path):
        for file_name in files:
            if file_name.endswith(".js"):
                file_path = os.path.join(root, file_name)
                convert_quotes(file_path)
                convert_imports(file_path)

if modified_files == 0:
    print("No se encontraron archivos para modificar.")
else:
    print(f"Archivos modificados: {modified_files}")
    print(f"Archivos no modificados: {unmodified_files}")
