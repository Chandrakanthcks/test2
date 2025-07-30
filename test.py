def star_pyramid(height):
    """Creates a pyramid using asterisks"""
    print("Star Pyramid:")
    for i in range(height):
        # Print spaces for centering
        spaces = " " * (height - i - 1)
        # Print stars
        stars = "*" * (2 * i + 1)
        print(spaces + stars)
    print()

def number_pyramid(height):
    """Creates a pyramid using numbers"""
    print("Number Pyramid:")
    for i in range(1, height + 1):
        # Print spaces for centering
        spaces = " " * (height - i)
        # Print numbers
        numbers = ""
        for j in range(1, i + 1):
            numbers += str(j) + " "
        print(spaces + numbers.strip())
    print()

def hollow_pyramid(height):
    """Creates a hollow pyramid using asterisks"""
    print("Hollow Pyramid:")
    for i in range(height):
        spaces = " " * (height - i - 1)
        if i == 0:
            # First row - just one star
            print(spaces + "*")
        elif i == height - 1:
            # Last row - fill with stars
            stars = "*" * (2 * i + 1)
            print(spaces + stars)
        else:
            # Middle rows - hollow
            stars = "*" + " " * (2 * i - 1) + "*"
            print(spaces + stars)
    print()

def inverted_pyramid(height):
    """Creates an inverted pyramid using asterisks"""
    print("Inverted Pyramid:")
    for i in range(height, 0, -1):
        spaces = " " * (height - i)
        stars = "*" * (2 * i - 1)
        print(spaces + stars)
    print()

def diamond_pattern(height):
    """Creates a diamond pattern using asterisks"""
    print("Diamond Pattern:")
    # Upper half (including middle)
    for i in range(height):
        spaces = " " * (height - i - 1)
        stars = "*" * (2 * i + 1)
        print(spaces + stars)
    
    # Lower half
    for i in range(height - 2, -1, -1):
        spaces = " " * (height - i - 1)
        stars = "*" * (2 * i + 1)
        print(spaces + stars)
    print()

def pascal_triangle(height):
    """Creates Pascal's triangle"""
    print("Pascal's Triangle:")
    for i in range(height):
        # Calculate spaces for centering
        spaces = " " * (height - i - 1) * 2
        
        # Calculate Pascal's triangle values
        row = []
        for j in range(i + 1):
            if j == 0 or j == i:
                row.append(1)
            else:
                # Previous row values
                prev_row = pascal_values[i-1] if 'pascal_values' in locals() else []
                if len(prev_row) > j-1 and len(prev_row) > j:
                    row.append(prev_row[j-1] + prev_row[j])
                else:
                    row.append(1)
        
        # Store for next iteration
        if i == 0:
            pascal_values = [[1]]
        else:
            pascal_values.append(row)
        
        # Print the row
        row_str = "   ".join(str(num) for num in row)
        print(spaces + row_str)
    print()

# Main execution
if __name__ == "__main__":
    print("🐍 PYTHON PYRAMID PATTERNS 🐍")
    print("=" * 40)
    
    # Set the height of pyramids
    height = 6
    
    # Display different pyramid patterns
    star_pyramid(height)
    number_pyramid(height)
    hollow_pyramid(height)
    inverted_pyramid(height)
    diamond_pattern(5)  # Smaller diamond for better display
    
    # Pascal's triangle (simpler implementation)
    print("Pascal's Triangle (Simple):")
    n = 5
    for i in range(n):
        spaces = " " * (n - i - 1) * 2
        row = ""
        coeff = 1
        for j in range(i + 1):
            row += f"{coeff:3} "
            coeff = coeff * (i - j) // (j + 1)
        print(spaces + row)
    
    print("\n🎉 Pyramid patterns complete! 🎉")