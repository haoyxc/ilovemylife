import org.apache.hadoop.mapreduce.*;

public class IterReducer extends Reducer<Text,Text,Text,Text>{

	public void reduce(Text key, Iterable<Text> values, Context context) throws IOException, InterruptedException 
	{
		ArrayList<String> fromNodes = new ArrayList<String>();
		StringBuffer out = new StringBuffer();

        double normalize = 0; 
        boolean seen = false; 
        String weightUpdate = "";
		for (Text v : values){
			String[] parts = v.toString().split(";");
            fromNodes.add(parts[0]);
            
            String weight = "0.0";
            String labelWeight = parts[1];
            String label = labelWeight.substring(0, labelWeight.indexOf("-"));

            if(label.equals(key.toString())){ //hardcode to 1 if label reaches where it originated from
                if(!seen){
                    weight = 1.0;
                    weightUpdate += label + "-" + "1.0,"; 
                    seen = true;
                } 
            } else {
                weight = labelWeight.substring(labelWeight.indexOf("-")+1);
                weightUpdate += label + "-" + weight + ","; 
            }

            normalize += Double.parseDouble(weight);

		}

        out.deleteCharAt(out.length()-1);//remove extra comma
		
        String[] parts = weightUpdate.split(",");
        for(int i = 0; i < parts.length; i++){
            String labelWeight = parts[i];
            String label = labelWeight.substring(0, labelWeight.indexOf("-"));
            String weight = labelWeight.substring(labelWeight.indexOf("-")+1);
	    //Normalize by summing total weights at this node
            Double normalizedWeight = (Double.parseDouble(weight))/normalize; 

            out.append(label);
            out.append("-");
            out.append(normalizedWeight);
            out.append(",");
        }

        out.deleteCharAt(out.length()-1);//remove extra comma
        out.append(";");

        for(String n : fromNodes){
            out.append(n);
            out.append("-");
            out.append(1/(fromNodes.size()));
            out.append(",");
        }
        
        out.deleteCharAt(out.length()-1);//remove extra comma
		
		
		context.write(key, new Text(out.toString() ));
	}
}
